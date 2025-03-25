"use client";

import { Card } from "flowbite-react";

interface OrgDetailCardProps {
  title: string;
  children: React.ReactNode;
}

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
