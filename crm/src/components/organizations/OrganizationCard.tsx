"use client";

import { Link } from 'react-router-dom';

function OrganizationCard() {
  return (
    <div className="bg-white p-6 rounded-md shadow-md dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-2 dark:text-gray-100">Organizations</h2>
      <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">
        Manage and view all your organizations.
      </p>
      <Link
        to="/organizations"
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md dark:bg-blue-800 dark:hover:bg-blue-900"
      >
        View Organizations
      </Link>
    </div>
  );
}

export default OrganizationCard;