/**
 * Utility functions for handling address data
 */

import { RecordModel } from "pocketbase";

/**
 * Interface for parsed address data
 */
export interface ParsedAddress {
  street: string;
  city: string;
  state: string;
  zip_code: string;
}

/**
 * Parses a comma-separated address string into components
 * 
 * @param addressString The address string to parse (e.g., "123 Main St, Chicago, IL, 60601")
 * @returns Object with street, city, state, and zip_code
 */
export const parseAddressString = (addressString: string): ParsedAddress => {
  // Split by commas and trim each part
  const parts = addressString.split(',').map(part => part.trim());
  
  // Default values in case the format isn't exactly as expected
  const defaults = {
    street: parts[0] || '',
    city: parts[1] || '',
    state: parts[2] || '',
    zip_code: parts[3] || ''
  };
  
  return defaults;
};

/**
 * Formats an address record into a single string
 * 
 * @param addressRecord The address record from PocketBase
 * @returns Formatted address string
 */
export const formatAddressRecord = (addressRecord: RecordModel | null): string => {
  if (!addressRecord) return '';
  
  const { street, city, state, zip_code } = addressRecord;
  const parts = [street, city, state, zip_code].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Checks if an address string is valid
 * 
 * @param addressString The address string to validate
 * @returns Boolean indicating if the address has all required parts
 */
export const isValidAddressString = (addressString: string): boolean => {
  const { street, city, state } = parseAddressString(addressString);
  
  // Check that at least street, city and state are provided
  return Boolean(street && city && state);
};

export default { parseAddressString, formatAddressRecord, isValidAddressString };