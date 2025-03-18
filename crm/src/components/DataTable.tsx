"use client";

import { Checkbox, Table } from "flowbite-react";
import { RecordModel } from "pocketbase";
import { Link } from 'react-router-dom'; // Import Link

interface DataTableProps {
    data: RecordModel[];
    fields: string[];
    fieldLabels?: { [key: string]: string }; // Optional field labels mapping
}

export function DataTable({ data, fields, fieldLabels }: DataTableProps) {
    const renderCellValue = (item: RecordModel, field: string) => {
        const value = item[field];
        if (typeof value === 'boolean') {
            return value ? '✓' : '✗';
        }
        return value;
    };

    const getCellClass = (item: RecordModel, field: string) => {
        const value = item[field];
        if (typeof value === 'boolean' && !value) {
            return 'text-red-500'; // Apply red color for false
        }
        return 'whitespace-nowrap font-medium text-gray-900 dark:text-white';
    };

    return (
        <div className="overflow-x-auto">
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell className="p-4">
                        <Checkbox />
                    </Table.HeadCell>
                    {fields.map((field) => (
                        <Table.HeadCell key={field}>
                            {fieldLabels && fieldLabels[field] ? fieldLabels[field] : field}
                        </Table.HeadCell>
                    ))}
                    <Table.HeadCell>
                        <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {data.map((item) => (
                        <Table.Row key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="p-4">
                                <Checkbox />
                            </Table.Cell>
                            {fields.map((field) => (
                                field === 'name' ? (
                                    <Table.Cell key={`${item.id}-${field}`} className="whitespace-nowrap font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                        <Link to={`/organizations/${item.id}`}>{item[field]}</Link>
                                    </Table.Cell>
                                ) : (
                                    <Table.Cell key={`${item.id}-${field}`} className={getCellClass(item, field)}>
                                        {renderCellValue(item, field)}
                                    </Table.Cell>
                                )
                            ))}
                            <Table.Cell>
                                <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                    Edit
                                </a>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}