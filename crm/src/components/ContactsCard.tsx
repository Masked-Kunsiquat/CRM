"use client";

import { useState, useEffect } from 'react';
import { RecordModel } from 'pocketbase';
import getPocketBase from '../api/pocketbase';
import OrgDetailCard from './OrgDetailCard';
import { useParams } from 'react-router-dom';
import { DataTable } from './DataTable';

export function ContactsCard() {
    const [contacts, setContacts] = useState<RecordModel[]>([]);
    const [activeTab, setActiveTab] = useState<'internal' | 'external' | 'all'>('all');
    const pb = getPocketBase();
    const { id: organizationId } = useParams();
    const contactFields = ['first_name', 'last_name', 'role'];
    const contactFieldLabels = {
        first_name: 'First Name',
        last_name: 'Last Name',
        role: 'Role',
    };

    useEffect(() => {
        const abortController = new AbortController();

        const fetchContacts = async () => {
            try {
                if (organizationId) {
                    let filter = `organization = "${organizationId}"`;

                    if (activeTab === 'internal') {
                        filter += ` && type = "internal"`;
                    } else if (activeTab === 'external') {
                        filter += ` && type = "external"`;
                    }

                    const result = await pb.collection('contacts').getList(1, 50, {
                        filter: filter,
                        signal: abortController.signal,
                    });
                    setContacts(result.items);
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching contacts:', error);
                }
            }
        };

        fetchContacts();

        return () => {
            abortController.abort();
        };
    }, [organizationId, activeTab]);

    return (
        <OrgDetailCard title="Contacts">
            <div className="mb-4">
                <button
                    className={`px-4 py-2 rounded-l-lg ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
                    onClick={() => setActiveTab('all')}
                >
                    All
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'internal' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
                    onClick={() => setActiveTab('internal')}
                >
                    Internal
                </button>
                <button
                    className={`px-4 py-2 rounded-r-lg ${activeTab === 'external' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
                    onClick={() => setActiveTab('external')}
                >
                    External
                </button>
            </div>
            {contacts.length > 0 ? (
                <DataTable
                    data={contacts}
                    fields={contactFields}
                    fieldLabels={contactFieldLabels}
                />
            ) : (
                <p className="text-gray-900 dark:text-white">No Contacts Found</p>
            )}
        </OrgDetailCard>
    );
}

export default ContactsCard;