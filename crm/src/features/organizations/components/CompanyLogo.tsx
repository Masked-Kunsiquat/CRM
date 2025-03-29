"use client";

import { Avatar } from "flowbite-react";
import { CompanyLogoProps } from "../types";

/**
 * Renders a company logo image or fallback initials using `Avatar`.
 *
 * - Constructs the image URL from PocketBase if `logo` is provided
 * - Falls back to initials from `orgName` if no logo exists
 * - Applies a consistent layout and container styling
 *
 * @param {CompanyLogoProps} props - Props for building the logo display
 * @returns {JSX.Element} A styled logo section for a company or organization
 */
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
