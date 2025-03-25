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
    <div className="mb-6 flex w-full justify-center">
      <div className="w-full rounded-xl border bg-white p-4 shadow-lg dark:bg-gray-800 md:w-3/4 lg:w-1/2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${orgName} Logo`}
            className="h-24 w-full object-contain"
          />
        ) : (
          <div className="flex justify-center">
            <Avatar
              placeholderInitials={initials || "?"}
              className="h-24 w-24 text-3xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}
