// Organizations.tsx
"use client";

import { useState } from 'react';
import { useOrganizations } from '../api/useOrganizations';
import { OrganizationsTable } from '../components/organizations/OrganizationsTable';

function Organizations() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const {
    data,
    isLoading,
    isError,
    error
  } = useOrganizations(page, perPage);

  const handlePageChange = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 dark:bg-gray-900 dark:text-white h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 dark:bg-gray-900 dark:text-white h-screen">
        <p>Error: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white h-screen">
      <h1 className="text-2xl font-semibold mb-4 dark:text-gray-100">Organizations</h1>
      <OrganizationsTable organizations={data?.organizations || []} />
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 mx-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="dark:text-white">
          Page {page} of {data?.totalPages || 1}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === data?.totalPages}
          className="px-4 py-2 mx-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Organizations;
