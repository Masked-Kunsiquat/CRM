#!/usr/bin/env python3
"""
Converter Module for Audit Wizard
Handles conversion between YAML and JSON formats
"""

import json
import yaml
from datetime import datetime
from typing import Dict, List, Any


class AuditConverter:
    """Converter for audit records between YAML and JSON formats."""

    @staticmethod
    def yaml_to_json(yaml_data: Dict) -> List[Dict]:
        """Convert YAML audit data to JSON format.
        
        Args:
            yaml_data: YAML data structure (dict with 'accounts' key)
            
        Returns:
            List[Dict]: List of audit records in JSON format
        """
        json_audits = []
        
        for account in yaml_data.get('accounts', []):
            account_id = account.get('id')
            for audit in account.get('audits', []):
                # Create a JSON audit record
                json_audit = {
                    "account": account_id,
                    "date": datetime.strptime(audit.get('date'), "%Y-%m-%d").isoformat() + ".000Z",
                    "status": audit.get('status', 'completed'),
                    "note": audit.get('note', ''),
                    "visited_floors": json.dumps(audit.get('visited_floors', [])),
                    "score": audit.get('score')
                }
                
                # Add record_id if it exists
                if 'id' in audit:
                    json_audit['id'] = audit['id']
                    
                json_audits.append(json_audit)
        
        return json_audits

    @staticmethod
    def json_to_yaml(json_audits: List[Dict]) -> Dict:
        """Convert JSON audit records to YAML format.
        
        Args:
            json_audits: List of audit records in JSON format
            
        Returns:
            Dict: YAML data structure with 'accounts' key
        """
        accounts = {}
        
        for audit in json_audits:
            account_id = audit.get('account')
            
            # Create account entry if it doesn't exist
            if account_id not in accounts:
                accounts[account_id] = {
                    'id': account_id,
                    'audits': []
                }
            
            # Extract date as YYYY-MM-DD format
            date_str = audit.get('date', '')
            if date_str.endswith('Z'):
                # Handle ISO format dates
                date_obj = datetime.fromisoformat(date_str[:-1])
                date = date_obj.strftime("%Y-%m-%d")
            else:
                date = date_str
            
            # Parse visited_floors from JSON string
            try:
                visited_floors = json.loads(audit.get('visited_floors', '[]'))
            except (json.JSONDecodeError, TypeError):
                # Handle case where visited_floors might not be a JSON string
                if isinstance(audit.get('visited_floors'), list):
                    visited_floors = audit.get('visited_floors')
                else:
                    visited_floors = []
            
            # Create YAML audit entry
            yaml_audit = {
                'date': date,
                'visited_floors': visited_floors,
                'status': audit.get('status', 'completed'),
                'note': audit.get('note', ''),
                'score': audit.get('score')
            }
            
            # Add record_id if it exists
            if 'id' in audit:
                yaml_audit['id'] = audit['id']
            
            accounts[account_id]['audits'].append(yaml_audit)
        
        # Convert to list format for YAML
        accounts_list = list(accounts.values())
        return {'accounts': accounts_list}

    @staticmethod
    def yaml_file_to_json_file(yaml_path: str, json_path: str) -> bool:
        """Convert a YAML file to a JSON file.
        
        Args:
            yaml_path: Path to the input YAML file
            json_path: Path to the output JSON file
            
        Returns:
            bool: True if conversion was successful
        """
        try:
            # Read YAML file
            with open(yaml_path, 'r') as file:
                yaml_data = yaml.safe_load(file)
            
            # Convert to JSON format
            json_audits = AuditConverter.yaml_to_json(yaml_data)
            
            # Write JSON file
            with open(json_path, 'w') as file:
                json.dump(json_audits, file, indent=2)
                
            return True
        except Exception as e:
            print(f"Error converting YAML to JSON: {str(e)}")
            return False

    @staticmethod
    def json_file_to_yaml_file(json_path: str, yaml_path: str) -> bool:
        """Convert a JSON file to a YAML file.
        
        Args:
            json_path: Path to the input JSON file
            yaml_path: Path to the output YAML file
            
        Returns:
            bool: True if conversion was successful
        """
        try:
            # Read JSON file
            with open(json_path, 'r') as file:
                json_audits = json.load(file)
            
            # Convert to YAML format
            yaml_data = AuditConverter.json_to_yaml(json_audits)
            
            # Write YAML file
            with open(yaml_path, 'w') as file:
                yaml.dump(yaml_data, file, default_flow_style=False, sort_keys=False)
                
            return True
        except Exception as e:
            print(f"Error converting JSON to YAML: {str(e)}")
            return False