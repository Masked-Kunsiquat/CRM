"use client";

import { useState, useEffect } from 'react';
import { RecordModel } from 'pocketbase';
import getPocketBase from '../api/pocketbase';
import OrgDetailCard from './OrgDetailCard';
import { useParams } from 'react-router-dom';
import { DataTable } from './DataTable';

export function SubaccountsCard() {
    const [subaccounts, setSubaccounts] = useState<RecordModel[]>([]);
    const pb = getPocketBase();
    const { id: organizationId } = useParams();
    const subaccountFields = ['name', 'active', 'created'];
    const subaccountFieldLabels = {
        name: 'Name',
        active: 'Active',
        created: 'Created',
    };

    useEffect(() => {
        const abortController = new AbortController();

        const fetchSubaccounts = async () => {
            try {
                if (organizationId) {
                    const result = await pb.collection('subaccounts').getList(1, 50, {
                        filter: `organization = "${organizationId}"`,
                        signal: abortController.signal,
                    });
                    setSubaccounts(result.items);
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching subaccounts:', error);
                }
            }
        };

        fetchSubaccounts();

        return () => {
            abortController.abort();
        };
    }, [organizationId]);

    return (
        <OrgDetailCard title="Subaccounts">
            {subaccounts.length > 0 ? (
                <DataTable
                    data={subaccounts}
                    fields={subaccountFields}
                    fieldLabels={subaccountFieldLabels}
                />
            ) : (
                <p className="text-gray-900 dark:text-white">No Subaccounts Found</p>
            )}
        </OrgDetailCard>
    );
}

export default SubaccountsCard;