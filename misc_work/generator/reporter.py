#!/usr/bin/env python3
"""
Report Module for Audit Wizard
Generates statistics and summaries from audit data
"""

import json
import yaml
from datetime import datetime
from typing import Dict, List, Any, Union, Tuple


class AuditReporter:
    """Reporter for generating statistics and summaries from audit data."""

    @staticmethod
    def generate_report(data: Union[Dict, List], format_type: str = None) -> str:
        """Generate a comprehensive report from audit data.
        
        Args:
            data: Audit data in either YAML or JSON format
            format_type: Optional format type hint ('yaml' or 'json')
            
        Returns:
            str: Formatted report text
        """
        # Determine format based on data structure if not specified
        if format_type is None:
            if isinstance(data, dict) and 'accounts' in data:
                format_type = 'yaml'
            elif isinstance(data, list):
                format_type = 'json'
            else:
                raise ValueError("Unable to determine data format type")
                
        # Process data based on format
        if format_type == 'yaml':
            return AuditReporter._generate_yaml_report(data)
        else:
            return AuditReporter._generate_json_report(data)

    @staticmethod
    def _generate_yaml_report(data: Dict) -> str:
        """Generate a report from YAML format audit data.
        
        Args:
            data: YAML format audit data (dict with 'accounts' key)
            
        Returns:
            str: Formatted report text
        """
        report = []
        report.append("=" * 60)
        report.append("AUDIT RECORDS REPORT")
        report.append("=" * 60)
        report.append("")
        
        total_audits = 0
        missing_scores = 0
        accounts_summary = []
        floor_data = {}
        audits_by_year = {}
        
        for account in data['accounts']:
            account_id = account['id']
            audits = account['audits']
            total_audits += len(audits)
            
            # Count audits with missing scores
            account_missing_scores = sum(1 for audit in audits if audit.get('score') is None)
            missing_scores += account_missing_scores
            
            # Collect audit dates and analyze them
            audit_dates = []
            for audit in audits:
                date_str = audit['date']
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                audit_dates.append(date_obj)
                
                # Track audits by year
                year = date_obj.year
                if year not in audits_by_year:
                    audits_by_year[year] = 0
                audits_by_year[year] += 1
                
                # Track floor visit frequency
                for floor in audit.get('visited_floors', []):
                    if floor not in floor_data:
                        floor_data[floor] = 0
                    floor_data[floor] += 1
            
            first_date = min(audit_dates).strftime("%Y-%m-%d") if audit_dates else 'N/A'
            last_date = max(audit_dates).strftime("%Y-%m-%d") if audit_dates else 'N/A'
            
            # Calculate average time between audits
            if len(audit_dates) > 1:
                sorted_dates = sorted(audit_dates)
                time_diffs = [(sorted_dates[i+1] - sorted_dates[i]).days 
                              for i in range(len(sorted_dates)-1)]
                avg_days_between = sum(time_diffs) / len(time_diffs)
            else:
                avg_days_between = 'N/A'
            
            accounts_summary.append({
                'id': account_id,
                'audit_count': len(audits),
                'first_audit': first_date,
                'last_audit': last_date,
                'missing_scores': account_missing_scores,
                'avg_days_between': avg_days_between
            })
        
        # Generate the report text
        report.append(f"Total Accounts: {len(data['accounts'])}")
        report.append(f"Total Audits: {total_audits}")
        report.append(f"Audits Missing Scores: {missing_scores} ({missing_scores/total_audits*100:.1f}% of all audits)")
        report.append("")
        
        # Audits by year
        report.append("AUDITS BY YEAR")
        report.append("-" * 60)
        for year in sorted(audits_by_year.keys()):
            report.append(f"{year}: {audits_by_year[year]} audits " +
                         f"({audits_by_year[year]/total_audits*100:.1f}%)")
        report.append("")
        
        # Most frequently visited floors
        report.append("TOP 10 MOST FREQUENTLY VISITED FLOORS")
        report.append("-" * 60)
        top_floors = sorted(floor_data.items(), key=lambda x: x[1], reverse=True)[:10]
        for floor, count in top_floors:
            report.append(f"Floor {floor}: {count} visits ({count/total_audits*100:.1f}%)")
        report.append("")
        
        # Account summary
        report.append("ACCOUNT SUMMARY")
        report.append("-" * 60)
        for summary in accounts_summary:
            report.append(f"Account: {summary['id']}")
            report.append(f"  Audit Count: {summary['audit_count']}")
            report.append(f"  First Audit: {summary['first_audit']}")
            report.append(f"  Last Audit: {summary['last_audit']}")
            report.append(f"  Missing Scores: {summary['missing_scores']} " +
                         f"({summary['missing_scores']/summary['audit_count']*100:.1f}%)")
            if summary['avg_days_between'] != 'N/A':
                report.append(f"  Avg. Days Between Audits: {summary['avg_days_between']:.1f}")
            else:
                report.append(f"  Avg. Days Between Audits: {summary['avg_days_between']}")
            report.append("")
        
        return "\n".join(report)

    @staticmethod
    def _generate_json_report(data: List[Dict]) -> str:
        """Generate a report from JSON format audit data.
        
        Args:
            data: JSON format audit data (list of audit records)
            
        Returns:
            str: Formatted report text
        """
        report = []
        report.append("=" * 60)
        report.append("AUDIT RECORDS REPORT")
        report.append("=" * 60)
        report.append("")
        
        total_audits = len(data)
        missing_scores = sum(1 for audit in data if audit.get('score') is None)
        
        # Group by account
        accounts = {}
        floor_data = {}
        audits_by_year = {}
        
        for audit in data:
            account_id = audit.get('account', 'unknown')
            if account_id not in accounts:
                accounts[account_id] = []
            accounts[account_id].append(audit)
            
            # Parse date
            date_str = audit.get('date', '')
            if date_str.endswith('Z'):
                date_obj = datetime.fromisoformat(date_str[:-1])
            else:
                try:
                    date_obj = datetime.fromisoformat(date_str)
                except ValueError:
                    continue  # Skip if date can't be parsed
            
            # Track audits by year
            year = date_obj.year
            if year not in audits_by_year:
                audits_by_year[year] = 0
            audits_by_year[year] += 1
            
            # Track floor visit frequency
            try:
                floors = json.loads(audit.get('visited_floors', '[]'))
                if isinstance(floors, list):
                    for floor in floors:
                        if floor not in floor_data:
                            floor_data[floor] = 0
                        floor_data[floor] += 1
            except (json.JSONDecodeError, TypeError):
                pass  # Skip if visited_floors can't be parsed
        
        # Process account summaries
        accounts_summary = []
        for account_id, audits in accounts.items():
            # Extract and parse dates
            audit_dates = []
            for audit in audits:
                date_str = audit.get('date', '')
                if date_str.endswith('Z'):
                    date_obj = datetime.fromisoformat(date_str[:-1])
                    audit_dates.append(date_obj)
                else:
                    try:
                        date_obj = datetime.fromisoformat(date_str)
                        audit_dates.append(date_obj)
                    except ValueError:
                        continue  # Skip if date can't be parsed
            
            first_date = min(audit_dates).strftime("%Y-%m-%d") if audit_dates else 'N/A'
            last_date = max(audit_dates).strftime("%Y-%m-%d") if audit_dates else 'N/A'
            
            # Calculate average time between audits
            if len(audit_dates) > 1:
                sorted_dates = sorted(audit_dates)
                time_diffs = [(sorted_dates[i+1] - sorted_dates[i]).days 
                              for i in range(len(sorted_dates)-1)]
                avg_days_between = sum(time_diffs) / len(time_diffs)
            else:
                avg_days_between = 'N/A'
            
            accounts_summary.append({
                'id': account_id,
                'audit_count': len(audits),
                'first_audit': first_date,
                'last_audit': last_date,
                'missing_scores': sum(1 for audit in audits if audit.get('score') is None),
                'avg_days_between': avg_days_between
            })
        
        # Generate the report text
        report.append(f"Total Accounts: {len(accounts)}")
        report.append(f"Total Audits: {total_audits}")
        report.append(f"Audits Missing Scores: {missing_scores} ({missing_scores/total_audits*100:.1f}% of all audits)")
        report.append("")
        
        # Audits by year
        report.append("AUDITS BY YEAR")
        report.append("-" * 60)
        for year in sorted(audits_by_year.keys()):
            report.append(f"{year}: {audits_by_year[year]} audits " +
                         f"({audits_by_year[year]/total_audits*100:.1f}%)")
        report.append("")
        
        # Most frequently visited floors
        report.append("TOP 10 MOST FREQUENTLY VISITED FLOORS")
        report.append("-" * 60)
        top_floors = sorted(floor_data.items(), key=lambda x: x[1], reverse=True)[:10]
        for floor, count in top_floors:
            report.append(f"Floor {floor}: {count} visits ({count/total_audits*100:.1f}%)")
        report.append("")
        
        # Account summary
        report.append("ACCOUNT SUMMARY")
        report.append("-" * 60)
        for summary in sorted(accounts_summary, key=lambda x: x['id']):
            report.append(f"Account: {summary['id']}")
            report.append(f"  Audit Count: {summary['audit_count']}")
            report.append(f"  First Audit: {summary['first_audit']}")
            report.append(f"  Last Audit: {summary['last_audit']}")
            if summary['audit_count'] > 0:
                report.append(f"  Missing Scores: {summary['missing_scores']} " +
                             f"({summary['missing_scores']/summary['audit_count']*100:.1f}%)")
            else:
                report.append(f"  Missing Scores: {summary['missing_scores']} (0.0%)")
            if summary['avg_days_between'] != 'N/A':
                report.append(f"  Avg. Days Between Audits: {summary['avg_days_between']:.1f}")
            else:
                report.append(f"  Avg. Days Between Audits: {summary['avg_days_between']}")
            report.append("")
        
        return "\n".join(report)

    @staticmethod
    def save_report_to_file(report: str, output_path: str) -> bool:
        """Save a generated report to a file.
        
        Args:
            report: Report text
            output_path: Path to output file
            
        Returns:
            bool: True if save was successful
        """
        try:
            with open(output_path, 'w') as file:
                file.write(report)
            return True
        except Exception as e:
            print(f"Error saving report: {str(e)}")
            return False

    @staticmethod
    def generate_report_from_file(input_path: str, output_path: str) -> bool:
        """Generate a report from a file and save it to another file.
        
        Args:
            input_path: Path to input YAML or JSON file
            output_path: Path to output report file
            
        Returns:
            bool: True if report generation was successful
        """
        try:
            # Determine file type and read data
            if input_path.endswith(('.yml', '.yaml')):
                with open(input_path, 'r') as file:
                    data = yaml.safe_load(file)
                format_type = 'yaml'
            else:
                with open(input_path, 'r') as file:
                    data = json.load(file)
                format_type = 'json'
            
            # Generate report
            report = AuditReporter.generate_report(data, format_type)
            
            # Save report to file
            return AuditReporter.save_report_to_file(report, output_path)
        except Exception as e:
            print(f"Error generating report from file: {str(e)}")
            return False