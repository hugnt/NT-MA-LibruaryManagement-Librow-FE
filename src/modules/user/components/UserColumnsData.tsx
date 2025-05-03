import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { getRoleName } from "@/lib/utils";
import { User } from "@/types/User";
import { ColumnDef } from "@tanstack/react-table";

export const UserColumnsData: ColumnDef<User>[] = [
    {
        accessorKey: 'fullname',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-40" column={column} title='Fullname' />
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
        accessorKey: 'username',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-40" column={column} title='Username' />
        ),
        cell: ({ row }) => <div>{row.getValue('username')}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-40" column={column} title='Email' />
        ),
        cell: ({ row }) => <div>{row.getValue('email')}</div>,
        enableSorting: false
    }
];