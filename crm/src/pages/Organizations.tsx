// Organizations.tsx
"use client";

import { useState } from "react";
import { useOrganizations } from "../api/useOrganizations";
import { OrganizationsTable } from "../components/organizations/OrganizationsTable";

function Organizations() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const { data, isLoading, isError, error } = useOrganizations(page, perPage);

  const handlePageChange = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen p-4 dark:bg-gray-900 dark:text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen p-4 dark:bg-gray-900 dark:text-white">
        <p>Error: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="h-screen p-4 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-4 text-2xl font-semibold dark:text-gray-100">
        Organizations
      </h1>
      <OrganizationsTable organizations={data?.organizations || []} />
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="mx-1 rounded bg-gray-200 px-4 py-2 disabled:opacity-50 dark:bg-gray-700"
        >
          Previous
        </button>
        <span className="dark:text-white">
          Page {page} of {data?.totalPages || 1}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === data?.totalPages}
          className="mx-1 rounded bg-gray-200 px-4 py-2 disabled:opacity-50 dark:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Organizations;
