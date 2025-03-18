"use client";

import { useState, useEffect } from 'react';
import getPocketBase from '../api/pocketbase';
import { RecordModel } from 'pocketbase';
import { DataTable } from '../components/DataTable';

function Organizations() {
    const [organizations, setOrganizations] = useState<RecordModel[]>([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const pb = getPocketBase();
    const fieldsToDisplay = ["name", "active", "city", "created", "updated"]; // Add city

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const result = await pb.collection('organizations').getList(page, perPage, {
                    sort: 'name',
                    expand: 'address', // Expand the address relation
                });
                // Process the result to extract the city
                const processedItems = result.items.map((item) => {
                    const expandedAddress = item.expand?.address as RecordModel;
                    return {
                        ...item,
                        city: expandedAddress?.city || 'N/A', // Extract city or use 'N/A'
                    };
                });

                setOrganizations(processedItems);
                setTotalPages(result.totalPages);
            } catch (error) {
                console.error('Error fetching organizations:', error);
            }
        };

        fetchOrganizations();
    }, [page, perPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="p-4 dark:bg-gray-900 dark:text-white h-screen">
            <h1 className="text-2xl font-semibold mb-4 dark:text-gray-100">Organizations</h1>
            <DataTable data={organizations} fields={fieldsToDisplay} />
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 mx-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="dark:text-white">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 mx-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Organizations;