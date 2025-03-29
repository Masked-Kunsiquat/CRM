// src/components/shared/AddressCard.tsx
"use client";

import OrgDetailCard from "../../features/organizations/components/OrgDetailCard";

type Address = {
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
};

type AddressCardProps = {
  title?: string; // Optional override for card title
  type?: "site" | "parking";
  address: Address | null;
};

/**
 * Displays an address inside an `OrgDetailCard`.
 *
 * - If no address is provided, shows a fallback message
 * - Can auto-generate a title based on `type` ("site", "parking") or accept a custom `title`
 * - Each field (street, city, state, zip) falls back to `"N/A"` if missing
 *
 * @param {AddressCardProps} props - Address data, type, and optional title override
 * @returns {JSX.Element} A card containing the formatted address or a fallback message
 */
const AddressCard = ({ title, type, address }: AddressCardProps) => {
  if (!address) {
    return (
      <OrgDetailCard title={title || formatType(type)}>
        <p className="italic text-gray-500 dark:text-gray-400">
          No address available
        </p>
      </OrgDetailCard>
    );
  }

  return (
    <OrgDetailCard title={title || formatType(type)}>
      <p>
        <strong>Street:</strong> {address.street || "N/A"}
      </p>
      <p>
        <strong>City:</strong> {address.city || "N/A"}
      </p>
      <p>
        <strong>State:</strong> {address.state || "N/A"}
      </p>
      <p>
        <strong>Zip:</strong> {address.zip_code || "N/A"}
      </p>
    </OrgDetailCard>
  );
};

// Optional helper to prettify type labels
const formatType = (type?: string) => {
  if (type === "parking") return "Parking Address";
  if (type === "site") return "Site Address";
  return "Address";
};

export default AddressCard;
