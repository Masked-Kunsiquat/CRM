"use client";

import { memo, useCallback, useState } from "react";
import { Checkbox, Table, Spinner } from "flowbite-react";
import { RecordModel } from "pocketbase";
import { Link } from "react-router-dom";

interface DataTableProps {
  data: RecordModel[];
  fields: string[];
  entityPath: string; // Generalized entity path
  fieldLabels?: { [key: string]: string };
  loading?: boolean;
  emptyMessage?: string;
}

/**
 * A flexible, reusable table component for displaying PocketBase records.
 *
 * - Automatically renders clickable names (links to `/${entityPath}/${item.id}`)
 * - Displays an "Edit" column with links to `/${entityPath}/edit/${item.id}`
 * - Handles booleans with ✓ or ✗ and applies red text for `false` values
 * - Supports optional loading and empty states
 * - Allows selection of rows via checkboxes (not exposed externally yet)
 *
 * @param {DataTableProps} props - Props for controlling data, fields, and labels
 * @returns {JSX.Element} A responsive table UI for record data
 */
function DataTable({
  data = [],
  fields,
  entityPath,
  fieldLabels,
  loading,
  emptyMessage = "No data available.",
}: DataTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleCheckbox = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const renderCellValue = useCallback((item: RecordModel, field: string) => {
    const value = item[field];
    if (typeof value === "boolean") {
      return value ? "✓" : "✗";
    }
    return value;
  }, []);

  const getCellClass = useCallback((item: RecordModel, field: string) => {
    const value = item[field];
    return typeof value === "boolean" && !value
      ? "text-red-500"
      : "whitespace-nowrap font-medium text-gray-900 dark:text-white";
  }, []);

  const renderFieldCell = useCallback(
    (item: RecordModel, field: string) => {
      if (field === "name") {
        return (
          <Table.Cell
            key={`${item.id}-${field}`}
            className="whitespace-nowrap font-medium text-cyan-600 hover:underline dark:text-cyan-500"
          >
            <Link to={`/${entityPath}/${item.id}`}>{item[field]}</Link>
          </Table.Cell>
        );
      } else {
        return (
          <Table.Cell
            key={`${item.id}-${field}`}
            className={getCellClass(item, field)}
          >
            {renderCellValue(item, field)}
          </Table.Cell>
        );
      }
    },
    [getCellClass, renderCellValue, entityPath],
  );

  if (loading) {
    return (
      <div className="py-10 text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="py-10 text-center text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="p-4">
            <Checkbox />
          </Table.HeadCell>
          {fields.map((field) => (
            <Table.HeadCell key={field}>
              {fieldLabels?.[field] || field}
            </Table.HeadCell>
          ))}
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((item) => (
            <Table.Row
              key={item.id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="p-4">
                <Checkbox
                  checked={selected.has(item.id)}
                  onChange={() => toggleCheckbox(item.id)}
                />
              </Table.Cell>
              {fields.map((field) => renderFieldCell(item, field))}
              <Table.Cell>
                <Link
                  to={`/${entityPath}/edit/${item.id}`}
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Edit
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default memo(DataTable);
