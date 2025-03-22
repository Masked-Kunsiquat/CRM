"use client";

import { Avatar } from "flowbite-react";

interface CompanyLogoProps {
  logo: string | null;
  orgId: string;
  orgName?: string;
  collectionId: string;
}

export function CompanyLogo({
  logo,
  orgId,
  orgName = "",
  collectionId,
}: CompanyLogoProps) {
  const baseUrl = import.meta.env.VITE_POCKETBASE_URL;
  const imageUrl = logo
    ? `${baseUrl}/api/files/${collectionId}/${orgId}/${logo}`
    : null;

  const initials = orgName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-full flex justify-center mb-6">
      <div className="border rounded-xl p-4 bg-white dark:bg-gray-800 shadow-lg w-full md:w-3/4 lg:w-1/2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${orgName} Logo`}
            className="h-24 w-full object-contain"
          />
        ) : (
          <div className="flex justify-center">
            <Avatar placeholderInitials={initials || "?"} className="h-24 w-24 text-3xl" />
          </div>
        )}
      </div>
    </div>
  );
}
