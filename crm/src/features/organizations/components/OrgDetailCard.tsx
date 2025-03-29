"use client";

import { Card } from "flowbite-react";
import { OrgDetailCardProps } from "../types";

/**
 * A reusable card component for displaying sections of organization details.
 *
 * - Renders a `Card` with a section title and injected content (`children`)
 * - Often used to wrap things like tables, forms, or related entity data
 *
 * @param {OrgDetailCardProps} props - The card title and content
 * @returns {JSX.Element} A styled card with a section heading
 */
export function OrgDetailCard({ title, children }: OrgDetailCardProps) {
  return (
    <Card className="mb-4">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      {children}
    </Card>
  );
}

export default OrgDetailCard;
