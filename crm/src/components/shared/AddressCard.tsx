// src/components/shared/AddressCard.tsx
"use client";

import OrgDetailCard from "../organizations/OrgDetailCard";

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

const AddressCard = ({ title, type, address }: AddressCardProps) => {
  if (!address) {
    return (
      <OrgDetailCard title={title || formatType(type)}>
        <p className="text-gray-500 dark:text-gray-400 italic">No address available</p>
      </OrgDetailCard>
    );
  }

  return (
    <OrgDetailCard title={title || formatType(type)}>
      <p><strong>Street:</strong> {address.street || "N/A"}</p>
      <p><strong>City:</strong> {address.city || "N/A"}</p>
      <p><strong>State:</strong> {address.state || "N/A"}</p>
      <p><strong>Zip:</strong> {address.zip_code || "N/A"}</p>
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
