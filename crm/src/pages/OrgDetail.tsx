"use client";

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import getPocketBase from '../api/pocketbase';
import OrgDetailCard from '../components/OrgDetailCard';
import ContactsCard from '../components/ContactsCard';
import AccountCard from '../components/AccountCard';
import SubaccountsCard from '../components/SubaccountsCard';
import { RecordModel } from 'pocketbase';

function OrgDetail() {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const [organization, setOrganization] = useState<RecordModel | null>(null);
    const pb = getPocketBase();

    useEffect(() => {
        const abortController = new AbortController();

        const fetchOrganization = async () => {
            try {
                const record = await pb.collection('organizations').getOne(id as string, {
                    expand: 'address',
                    signal: abortController.signal,
                });
                setOrganization(record);
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching organization:', error);
                }
            }
        };

        fetchOrganization();

        return () => {
            abortController.abort();
        };
    }, [id]);

    if (!organization) {
        return <div>Loading...</div>;
    }

    const expandedAddress = organization.expand?.address as RecordModel;

    return (
        <div className="p-4 dark:bg-gray-900 dark:text-white h-screen">
            <button onClick={() => navigate(-1)} className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Back
            </button>
            <h1 className="text-3xl font-semibold mb-4 dark:text-gray-100">
                {organization.name}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <OrgDetailCard title="Organization Details">
                    <p>ID: {organization.id}</p>
                    <p>Active: {organization.active ? 'Yes' : 'No'}</p>
                    <p>Created: {organization.created}</p>
                    <p>Updated: {organization.updated}</p>
                </OrgDetailCard>
                <OrgDetailCard title="Address">
                    <p>Street: {expandedAddress?.street || 'N/A'}</p>
                    <p>City: {expandedAddress?.city || 'N/A'}</p>
                    <p>State: {expandedAddress?.state || 'N/A'}</p>
                    <p>Zip: {expandedAddress?.zip_code || 'N/A'}</p>
                </OrgDetailCard>
                <ContactsCard />
                <AccountCard />
                <SubaccountsCard />
            </div>
        </div>
    );
}

export default OrgDetail;