#!/usr/bin/env python3
"""
PocketBase Audit Wizard
An interactive CLI utility for managing historical audit records in PocketBase
using YAML and JSON as input sources.
"""

import argparse
import json
import os
import sys
import yaml
from datetime import datetime
from typing import Dict, List, Optional, Any, Tuple

# Import custom modules
from converter import AuditConverter
from reporter import AuditReporter  # Make sure the file is named reporter.py, not report.py
from pocketbase_client import PocketBaseClient

# Constants for file paths
DEFAULT_YAML_PATH = "audits.yml"
DEFAULT_JSON_PATH = "pocketbase_audits.json"
DEFAULT_YAML_WITH_IDS_PATH = "audits_with_ids.yml"
DEFAULT_JSON_WITH_IDS_PATH = "pocketbase_audits_with_ids.json"
DEFAULT_REPORT_PATH = "audit_report.txt"

# PocketBase API settings
POCKETBASE_URL = os.environ.get("POCKETBASE_URL", "http://localhost:8090")
POCKETBASE_EMAIL = os.environ.get("POCKETBASE_EMAIL", "")
POCKETBASE_PASSWORD = os.environ.get("POCKETBASE_PASSWORD", "")
POCKETBASE_COLLECTION = os.environ.get("POCKETBASE_COLLECTION", "audits")


class AuditWizard:
    """Main class for the PocketBase Audit Wizard."""

    def __init__(self, args: argparse.Namespace):
        """Initialize the AuditWizard with command line arguments."""
        self.args = args
        self.pb_client = None
        
        # Initialize PocketBase client if URL is provided
        if hasattr(args, 'pb_url') and args.pb_url:
            self.pb_client = PocketBaseClient(args.pb_url)
            
        # Initialize converter and reporter
        self.converter = AuditConverter()
        self.reporter = AuditReporter()

    def run(self):
        """Run the appropriate command based on arguments."""
        if self.args.interactive:
            return self.run_interactive_wizard()

        command = self.args.command
        if command == "convert":
            return self.convert()
        elif command == "import":
            return self.import_audits()
        elif command == "update":
            return self.update_audits()
        elif command == "report":
            return self.generate_report()
        else:
            print(f"Unknown command: {command}")
            return 1

    def run_interactive_wizard(self):
        """Run the interactive wizard interface."""
        while True:
            self._clear_screen()
            print("="*50)
            print("Welcome to the PocketBase Audit Wizard!")
            print("="*50)
            print("\nPlease select an option:")
            print("1. Convert YAML to JSON")
            print("2. Convert JSON to YAML")
            print("3. Import audits into PocketBase")
            print("4. Update existing audits (e.g. add scores)")
            print("5. Generate report from audit file")
            print("6. Exit")
            
            choice = input("\nEnter your choice (1-6): ")
            
            if choice == "1":
                self._convert_yaml_to_json_interactive()
            elif choice == "2":
                self._convert_json_to_yaml_interactive()
            elif choice == "3":
                self._import_audits_interactive()
            elif choice == "4":
                self._update_audits_interactive()
            elif choice == "5":
                self._generate_report_interactive()
            elif choice == "6":
                print("\nExiting PocketBase Audit Wizard. Goodbye!")
                return 0
            else:
                print("\nInvalid choice. Please try again.")
            
            input("\nPress Enter to continue...")

    def _clear_screen(self):
        """Clear the terminal screen."""
        os.system('cls' if os.name == 'nt' else 'clear')

    def _convert_yaml_to_json_interactive(self):
        """Interactive YAML to JSON conversion."""
        print("\n== Convert YAML to JSON ==")
        yaml_path = input(f"Enter YAML file path [{DEFAULT_YAML_PATH}]: ") or DEFAULT_YAML_PATH
        json_path = input(f"Enter output JSON file path [{DEFAULT_JSON_PATH}]: ") or DEFAULT_JSON_PATH
        
        try:
            success = AuditConverter.yaml_file_to_json_file(yaml_path, json_path)
            if success:
                print(f"\nSuccessfully converted {yaml_path} to {json_path}")
            else:
                print(f"\nFailed to convert {yaml_path} to {json_path}")
        except Exception as e:
            print(f"\nError during conversion: {str(e)}")

    def _convert_json_to_yaml_interactive(self):
        """Interactive JSON to YAML conversion."""
        print("\n== Convert JSON to YAML ==")
        json_path = input(f"Enter JSON file path [{DEFAULT_JSON_PATH}]: ") or DEFAULT_JSON_PATH
        yaml_path = input(f"Enter output YAML file path [{DEFAULT_YAML_PATH}]: ") or DEFAULT_YAML_PATH
        
        try:
            success = AuditConverter.json_file_to_yaml_file(json_path, yaml_path)
            if success:
                print(f"\nSuccessfully converted {json_path} to {yaml_path}")
            else:
                print(f"\nFailed to convert {json_path} to {yaml_path}")
        except Exception as e:
            print(f"\nError during conversion: {str(e)}")

    def _import_audits_interactive(self):
        """Interactive import of audits to PocketBase."""
        print("\n== Import Audits to PocketBase ==")
        json_path = input(f"Enter JSON file path [{DEFAULT_JSON_PATH}]: ") or DEFAULT_JSON_PATH
        output_path = input(f"Enter output file path with IDs [{DEFAULT_JSON_WITH_IDS_PATH}]: ") or DEFAULT_JSON_WITH_IDS_PATH
        
        try:
            self._connect_to_pocketbase_interactive()
            audits = self._read_json_file(json_path)
            audits_with_ids = self._import_to_pocketbase(audits)
            self._write_json_file(audits_with_ids, output_path)
            print(f"\nSuccessfully imported audits to PocketBase and saved with IDs to {output_path}")
        except Exception as e:
            print(f"\nError during import: {str(e)}")

    def _update_audits_interactive(self):
        """Interactive update of existing audits in PocketBase."""
        print("\n== Update Existing Audits ==")
        json_path = input(f"Enter JSON file path with IDs [{DEFAULT_JSON_WITH_IDS_PATH}]: ") or DEFAULT_JSON_WITH_IDS_PATH
        
        try:
            self._connect_to_pocketbase_interactive()
            audits = self._read_json_file(json_path)
            updated_audits = self._update_in_pocketbase(audits)
            self._write_json_file(updated_audits, json_path)
            print(f"\nSuccessfully updated audits in PocketBase and saved to {json_path}")
        except Exception as e:
            print(f"\nError during update: {str(e)}")

    def _generate_report_interactive(self):
        """Interactive generation of audit report."""
        print("\n== Generate Audit Report ==")
        input_path = input(f"Enter input file path (YAML or JSON) [{DEFAULT_YAML_PATH}]: ") or DEFAULT_YAML_PATH
        report_path = input(f"Enter report output path [{DEFAULT_REPORT_PATH}]: ") or DEFAULT_REPORT_PATH
        
        try:
            success = AuditReporter.generate_report_from_file(input_path, report_path)
            if success:
                print(f"\nSuccessfully generated report at {report_path}")
            else:
                print(f"\nFailed to generate report at {report_path}")
        except Exception as e:
            print(f"\nError generating report: {str(e)}")

    def _connect_to_pocketbase_interactive(self):
        """Interactive connection to PocketBase with credentials."""
        print("\n== PocketBase Connection ==")
        url = input(f"Enter PocketBase URL [{POCKETBASE_URL}]: ") or POCKETBASE_URL
        email = input(f"Enter PocketBase admin email [{POCKETBASE_EMAIL}]: ") or POCKETBASE_EMAIL
        password = input("Enter PocketBase admin password: ") or POCKETBASE_PASSWORD
        collection = input(f"Enter collection name [{POCKETBASE_COLLECTION}]: ") or POCKETBASE_COLLECTION
        
        print("\nConnecting to PocketBase...")
        self.pb_client = PocketBaseClient(url)
        
        # Attempt authentication
        if self.pb_client.authenticate(email, password):
            print("Connection successful!")
            self.args.collection = collection  # Store collection for later use
        else:
            print("Connection failed. Will proceed in simulation mode.")
            # Create a minimal client for simulation
            self.pb_client.is_authenticated = False

    def convert(self):
        """Convert between YAML and JSON formats."""
        if self.args.to_format == "json":
            return self._convert_yaml_to_json()
        elif self.args.to_format == "yaml":
            return self._convert_json_to_yaml()
        else:
            print(f"Unknown conversion format: {self.args.to_format}")
            return 1
            
    def _convert_yaml_to_json(self):
        """Convert from YAML to JSON format."""
        input_file = self.args.input or DEFAULT_YAML_PATH
        output_file = self.args.output or DEFAULT_JSON_PATH
        
        try:
            success = AuditConverter.yaml_file_to_json_file(input_file, output_file)
            if success:
                print(f"Successfully converted {input_file} to {output_file}")
                return 0
            else:
                print(f"Failed to convert {input_file} to {output_file}")
                return 1
        except Exception as e:
            print(f"Error during conversion: {str(e)}")
            return 1
            
    def _convert_json_to_yaml(self):
        """Convert from JSON to YAML format."""
        input_file = self.args.input or DEFAULT_JSON_PATH
        output_file = self.args.output or DEFAULT_YAML_PATH
        
        try:
            success = AuditConverter.json_file_to_yaml_file(input_file, output_file)
            if success:
                print(f"Successfully converted {input_file} to {output_file}")
                return 0
            else:
                print(f"Failed to convert {input_file} to {output_file}")
                return 1
        except Exception as e:
            print(f"Error during conversion: {str(e)}")
            return 1

    def _read_json_file(self, file_path: str) -> List[Dict]:
        """Read JSON data from a file."""
        try:
            with open(file_path, 'r') as file:
                return json.load(file)
        except Exception as e:
            raise Exception(f"Error reading JSON file {file_path}: {str(e)}")

    def _write_json_file(self, data: List[Dict], file_path: str) -> bool:
        """Write JSON data to a file."""
        try:
            with open(file_path, 'w') as file:
                json.dump(data, file, indent=2)
            return True
        except Exception as e:
            raise Exception(f"Error writing to JSON file {file_path}: {str(e)}")

    def import_audits(self):
        """Import audit records into PocketBase."""
        input_file = self.args.input or DEFAULT_JSON_PATH
        output_file = self.args.output or DEFAULT_JSON_WITH_IDS_PATH
        
        try:
            audits = self._read_json_file(input_file)
            audits_with_ids = self._import_to_pocketbase(audits)
            self._write_json_file(audits_with_ids, output_file)
            print(f"Successfully imported audits to PocketBase and saved with IDs to {output_file}")
            return 0
        except Exception as e:
            print(f"Error during import: {str(e)}")
            return 1

    def _import_to_pocketbase(self, audits: List[Dict]) -> List[Dict]:
        """Import audit records to PocketBase and return records with IDs."""
        if not self.pb_client or not self.pb_client.is_authenticated:
            print("Error: Not authenticated with PocketBase")
            # Fallback to simulation if not connected
            import uuid
            
            audits_with_ids = []
            for audit in audits:
                # Skip if the audit already has an ID
                if 'id' in audit:
                    audits_with_ids.append(audit)
                    continue
                    
                # Clone the audit and add a simulated ID
                audit_with_id = audit.copy()
                audit_with_id['id'] = str(uuid.uuid4())[:15]
                audits_with_ids.append(audit_with_id)
                
                print(f"Simulated import audit for {audit['account']} on {audit['date']}")
            
            return audits_with_ids
        
        # Use the PocketBase client for actual imports
        collection = self.args.collection if hasattr(self.args, 'collection') else POCKETBASE_COLLECTION
        return self.pb_client.batch_import_audits(collection, audits)

    def update_audits(self):
        """Update existing audit records in PocketBase."""
        input_file = self.args.input or DEFAULT_JSON_WITH_IDS_PATH
        
        try:
            audits = self._read_json_file(input_file)
            updated_audits = self._update_in_pocketbase(audits)
            self._write_json_file(updated_audits, input_file)
            print(f"Successfully updated audits in PocketBase and saved to {input_file}")
            return 0
        except Exception as e:
            print(f"Error during update: {str(e)}")
            return 1

    def _update_in_pocketbase(self, audits: List[Dict]) -> List[Dict]:
        """Update existing audit records in PocketBase."""
        if not self.pb_client or not self.pb_client.is_authenticated:
            print("Error: Not authenticated with PocketBase")
            # Fallback to simulation if not connected
            updated_audits = []
            
            for audit in audits:
                # Skip audits without IDs (they can't be updated)
                if 'id' not in audit:
                    print(f"Warning: Audit for {audit['account']} on {audit['date']} has no ID, skipping")
                    updated_audits.append(audit)
                    continue
                
                # Simulate updating the record
                print(f"Simulated update audit {audit['id']} for {audit['account']} on {audit['date']}")
                updated_audits.append(audit)
            
            return updated_audits
        
        # Use the PocketBase client for actual updates
        collection = self.args.collection if hasattr(self.args, 'collection') else POCKETBASE_COLLECTION
        return self.pb_client.batch_update_audits(collection, audits)

    def generate_report(self):
        """Generate a report from the audit file."""
        input_file = self.args.input
        output_file = self.args.output or DEFAULT_REPORT_PATH
        
        try:
            success = AuditReporter.generate_report_from_file(input_file, output_file)
            if success:
                print(f"Report generated successfully at {output_file}")
                return 0
            else:
                print(f"Failed to generate report at {output_file}")
                return 1
        except Exception as e:
            print(f"Error generating report: {str(e)}")
            return 1


def main():
    """Main entry point for the PocketBase Audit Wizard."""
    parser = argparse.ArgumentParser(
        description="PocketBase Audit Wizard - Manage historical audit records"
    )
    
    # Global options
    parser.add_argument(
        "-i", "--interactive",
        action="store_true",
        help="Run in interactive wizard mode"
    )
    
    # Create subparsers for commands
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # Convert command
    convert_parser = subparsers.add_parser("convert", help="Convert between YAML and JSON")
    convert_parser.add_argument(
        "-f", "--format",
        dest="to_format",
        choices=["yaml", "json"],
        required=True,
        help="Target format to convert to"
    )
    convert_parser.add_argument(
        "-i", "--input",
        help=f"Input file path (default: {DEFAULT_YAML_PATH} or {DEFAULT_JSON_PATH})"
    )
    convert_parser.add_argument(
        "-o", "--output",
        help=f"Output file path (default: {DEFAULT_JSON_PATH} or {DEFAULT_YAML_PATH})"
    )
    
    # Import command
    import_parser = subparsers.add_parser("import", help="Import audits into PocketBase")
    import_parser.add_argument(
        "-i", "--input",
        help=f"Input JSON file path (default: {DEFAULT_JSON_PATH})"
    )
    import_parser.add_argument(
        "-o", "--output",
        help=f"Output JSON file path with IDs (default: {DEFAULT_JSON_WITH_IDS_PATH})"
    )
    
    # Update command
    update_parser = subparsers.add_parser("update", help="Update existing audits in PocketBase")
    update_parser.add_argument(
        "-i", "--input",
        help=f"Input JSON file path with IDs (default: {DEFAULT_JSON_WITH_IDS_PATH})"
    )
    
    # Report command
    report_parser = subparsers.add_parser("report", help="Generate report from audit file")
    report_parser.add_argument(
        "-i", "--input",
        required=True,
        help="Input file path (YAML or JSON)"
    )
    report_parser.add_argument(
        "-o", "--output",
        help=f"Output report file path (default: {DEFAULT_REPORT_PATH})"
    )
    
    # Parse arguments
    args = parser.parse_args()
    
    # If no command is specified and not in interactive mode, show help
    if not args.command and not args.interactive:
        parser.print_help()
        return 1
    
    # Run the wizard
    wizard = AuditWizard(args)
    return wizard.run()


if __name__ == "__main__":
    sys.exit(main())