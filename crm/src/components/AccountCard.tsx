"use client";

import { useState, useEffect } from 'react';
import { RecordModel } from 'pocketbase';
import getPocketBase from '../api/pocketbase';
import OrgDetailCard from './OrgDetailCard';
import { useParams } from 'react-router-dom';
import { DataTable } from './DataTable';

export function AccountCard() {
    const [accounts, setAccounts] = useState<RecordModel[]>([]);
    const pb = getPocketBase();
    const { id: organizationId } = useParams();
    const accountFields = ['name', 'status', 'created'];
    const accountFieldLabels = {
        name: 'Name',
        status: 'Status',
        created: 'Created',
    };

    useEffect(() => {
        const abortController = new AbortController();

        const fetchAccounts = async () => {
            try {
                if (organizationId) {
                    const result = await pb.collection('accounts').getList(1, 50, {
                        filter: `organization = "${organizationId}"`,
                        signal: abortController.signal,
                    });
                    setAccounts(result.items);
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching accounts:', error);
                }
            }
        };

        fetchAccounts();

        return () => {
            abortController.abort();
        };
    }, [organizationId]);

    return (
        <OrgDetailCard title="Accounts">
            {accounts.length > 0 ? (
                <DataTable
                    data={accounts}
                    fields={accountFields}
                    fieldLabels={accountFieldLabels}
                />
            ) : (
                <p className="text-gray-900 dark:text-white">No Accounts Found</p>
            )}
        </OrgDetailCard>
    );
}

export default AccountCard;