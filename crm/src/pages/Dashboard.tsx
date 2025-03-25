"use client";

import OrganizationCard from "../components/organizations/OrganizationCard";

export function Dashboard() {
  console.log("Dashboard component loaded");
  return (
    <div className="flex h-screen items-center justify-center dark:bg-gray-900 dark:text-white">
      <div className="rounded-md bg-white p-8 shadow-md dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-semibold dark:text-gray-100">
          Welcome to the Dashboard!
        </h1>
        <p className="dark:text-gray-200">
          This is a placeholder dashboard page.
        </p>
        <div className="mt-6">
          <OrganizationCard /> {/* Add the OrganizationCard */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
