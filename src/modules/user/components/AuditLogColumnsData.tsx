/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { hiddenLogFields } from "@/constants/hiddenLogFields";
import { getRoleName } from "@/lib/utils";
import { AuditLog } from "@/types/User";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const AuditLogColumnsData: ColumnDef<AuditLog>[] = [
    {
        accessorKey: 'fullname',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-30" column={column} title='User' />
        ),
        cell: ({ row }) => <div>{row.getValue('fullname')}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'role',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-20" column={column} title='Role' />
        ),
        cell: ({ row }) => <div>{getRoleName(row.original.role)}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'action',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-10" column={column} title='Action' />
        ),
        cell: ({ row }) => <div>{row.getValue('action')}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-20" column={column} title='Action time' />
        ),
        cell: ({ row }) => <div>{row.original.createdAt && format(row.original.createdAt, "MM/dd/yyyy HH:mm")}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'entityName',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-20" column={column} title='Action in entity' />
        ),
        cell: ({ row }) => <div>{row.getValue('entityName')}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'oldValues',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-40" column={column} title='Old values' />
        ),
        cell: ({ row }) => <DisplayJsonFields json={row.getValue('oldValues')} />,
        enableSorting: false
    },
    {
        accessorKey: 'newValues',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-40" column={column} title='New values' />
        ),
        cell: ({ row }) => <DisplayJsonFields json={row.getValue('newValues')} />,
        enableSorting: false
    },
];


function DisplayJsonFields({ json }: { json?: string }) {
    // console.log("json:", json)

    let parsed: Record<string, any> = {};
    try {
        if (json) parsed = JSON.parse(json);
        else return <div className="text-red-500">Invalid JSON</div>;
    } catch {
        return <div className="text-red-500">Invalid JSON</div>;
    }

    return (
        <div className="space-y-1 w-40 overflow-x-auto">
            {Object.entries(parsed)
                .filter(([key]) => !hiddenLogFields.includes(key))
                .map(([key, value]) => (
                    <div key={key} className="text-sm break-words">
                        <strong>{key}:</strong> {String(value)}
                    </div>
                ))}
        </div>
    );
}
