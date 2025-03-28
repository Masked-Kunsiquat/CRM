#!/usr/bin/env python3
"""
PocketBase API Client for the Audit Wizard
Handles communication with the PocketBase backend
"""

import json
import requests
from typing import Dict, List, Optional, Any


class PocketBaseClient:
    """Client for interacting with the PocketBase API."""

    def __init__(self, base_url: str):
        """Initialize the PocketBase client.
        
        Args:
            base_url: Base URL of the PocketBase instance
        """
        self.base_url = base_url.rstrip('/')
        self.token = None
        self.is_authenticated = False

    def authenticate(self, email: str, password: str) -> bool:
        """Authenticate with PocketBase using user credentials.
        
        Args:
            email: User email or identity
            password: User password
            
        Returns:
            bool: True if authentication was successful
        """
        # Use the users collection for authentication
        url = f"{self.base_url}/api/collections/users/auth-with-password"
        
        # Use identity field as shown in the error message
        payload = {"identity": email, "password": password}
        
        try:
            print(f"Attempting to authenticate with {url}")
            response = requests.post(url, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('token')
                self.is_authenticated = bool(self.token)
                print("Authentication successful!")
                return self.is_authenticated
            else:
                print(f"Authentication failed with status code: {response.status_code}")
                print(f"Response: {response.text}")
                return False
        except requests.RequestException as e:
            print(f"Authentication error: {str(e)}")
            self.token = None
            self.is_authenticated = False
            return False

    def _get_headers(self) -> Dict[str, str]:
        """Get headers for API requests including authentication token.
        
        Returns:
            Dict[str, str]: Headers dictionary
        """
        headers = {
            "Content-Type": "application/json"
        }
        
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
            
        return headers

    def create_record(self, collection: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new record in a PocketBase collection.
        
        Args:
            collection: Collection name
            data: Record data
            
        Returns:
            Optional[Dict[str, Any]]: Created record with ID or None on failure
        """
        if not self.is_authenticated:
            print("Error: Not authenticated")
            return None
            
        url = f"{self.base_url}/api/collections/{collection}/records"
        
        try:
            response = requests.post(url, json=data, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error creating record: {str(e)}")
            return None

    def update_record(self, collection: str, record_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing record in a PocketBase collection.
        
        Args:
            collection: Collection name
            record_id: ID of the record to update
            data: Updated record data
            
        Returns:
            Optional[Dict[str, Any]]: Updated record or None on failure
        """
        if not self.is_authenticated:
            print("Error: Not authenticated")
            return None
            
        url = f"{self.base_url}/api/collections/{collection}/records/{record_id}"
        
        try:
            response = requests.patch(url, json=data, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error updating record: {str(e)}")
            return None

    def get_record(self, collection: str, record_id: str) -> Optional[Dict[str, Any]]:
        """Get a record by its ID from a PocketBase collection.
        
        Args:
            collection: Collection name
            record_id: ID of the record to get
            
        Returns:
            Optional[Dict[str, Any]]: Record data or None if not found
        """
        if not self.is_authenticated:
            print("Error: Not authenticated")
            return None
            
        url = f"{self.base_url}/api/collections/{collection}/records/{record_id}"
        
        try:
            response = requests.get(url, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error getting record: {str(e)}")
            return None
            
    def list_records(self, collection: str, filter_str: str = None, sort: str = None, 
                    page: int = 1, per_page: int = 50) -> Optional[Dict[str, Any]]:
        """List records from a PocketBase collection with optional filtering and sorting.
        
        Args:
            collection: Collection name
            filter_str: Filter query string
            sort: Sort string (e.g., "-created,+name")
            page: Page number for pagination
            per_page: Number of records per page
            
        Returns:
            Optional[Dict[str, Any]]: Paginated records or None on failure
        """
        if not self.is_authenticated:
            print("Error: Not authenticated")
            return None
            
        url = f"{self.base_url}/api/collections/{collection}/records"
        params = {"page": page, "perPage": per_page}
        
        if filter_str:
            params["filter"] = filter_str
        if sort:
            params["sort"] = sort
            
        try:
            response = requests.get(url, params=params, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error listing records: {str(e)}")
            return None

    def delete_record(self, collection: str, record_id: str) -> bool:
        """Delete a record from a PocketBase collection.
        
        Args:
            collection: Collection name
            record_id: ID of the record to delete
            
        Returns:
            bool: True if deletion was successful
        """
        if not self.is_authenticated:
            print("Error: Not authenticated")
            return False
            
        url = f"{self.base_url}/api/collections/{collection}/records/{record_id}"
        
        try:
            response = requests.delete(url, headers=self._get_headers())
            response.raise_for_status()
            return True
        except requests.RequestException as e:
            print(f"Error deleting record: {str(e)}")
            return False

    def batch_import_audits(self, collection: str, audits: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Import multiple audit records in batch to PocketBase.
        
        Args:
            collection: Collection name
            audits: List of audit records to import
            
        Returns:
            List[Dict[str, Any]]: List of imported records with IDs
        """
        if not self.is_authenticated:
            print("Error: Not authenticated")
            return []
            
        imported_records = []
        for audit in audits:
            # Skip if the audit already has an ID
            if 'id' in audit and audit['id']:
                print(f"Skipping audit with existing ID: {audit['id']}")
                imported_records.append(audit)
                continue
                
            record = self.create_record(collection, audit)
            if record:
                # Extract the ID and add it to the original audit
                audit_with_id = audit.copy()
                audit_with_id['id'] = record.get('id')
                imported_records.append(audit_with_id)
                print(f"Imported audit for {audit.get('account')} on {audit.get('date')}")
            else:
                print(f"Failed to import audit for {audit.get('account')} on {audit.get('date')}")
                imported_records.append(audit)  # Keep the original audit in the list
                
        return imported_records

    def batch_update_audits(self, collection: str, audits: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Update multiple audit records in batch to PocketBase.
        
        Args:
            collection: Collection name
            audits: List of audit records to update (must have IDs)
            
        Returns:
            List[Dict[str, Any]]: List of updated records
        """
        if not self.is_authenticated:
            print("Error: Not authenticated")
            return audits
            
        updated_records = []
        for audit in audits:
            # Skip audits without IDs
            if 'id' not in audit or not audit['id']:
                print(f"Warning: Audit for {audit.get('account')} on {audit.get('date')} has no ID, skipping")
                updated_records.append(audit)
                continue
                
            record_id = audit['id']
            # Create a copy without the ID for the update
            update_data = audit.copy()
            update_data.pop('id', None)
            
            updated = self.update_record(collection, record_id, update_data)
            if updated:
                updated_records.append(audit)
                print(f"Updated audit {record_id} for {audit.get('account')} on {audit.get('date')}")
            else:
                print(f"Failed to update audit {record_id}")
                updated_records.append(audit)  # Keep the original audit in the list
                
        return updated_records