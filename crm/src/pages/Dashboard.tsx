"use client";

import OrganizationCard from '../components/OrganizationCard'; // Import OrganizationCard

export function Dashboard() {
    console.log("Dashboard component loaded");
  return (
    <div className="flex justify-center items-center h-screen dark:bg-gray-900 dark:text-white">
      <div className="bg-white p-8 rounded-md shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-semibold mb-4 dark:text-gray-100">Welcome to the Dashboard!</h1>
        <p className="dark:text-gray-200">This is a placeholder dashboard page.</p>
        <div className="mt-6">
          <OrganizationCard /> {/* Add the OrganizationCard */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;