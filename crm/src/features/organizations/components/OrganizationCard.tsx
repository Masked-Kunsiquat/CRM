"use client";

import { Link } from "react-router-dom";

/**
 * A simple overview card that links to the organizations list page.
 *
 * - Displays a title, description, and CTA button
 * - Styled as a card with dark mode support
 *
 * @returns {JSX.Element} A UI card with a link to `/organizations`
 */
function OrganizationCard() {
  return (
    <div className="rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-2 text-lg font-semibold dark:text-gray-100">
        Organizations
      </h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Manage and view all your organizations.
      </p>
      <Link
        to="/organizations"
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900"
      >
        View Organizations
      </Link>
    </div>
  );
}

export default OrganizationCard;
