import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { getStatusClassname } from "@/lib/utils";
import { BorrowingRequest } from "@/types/BookBorrowingRequest";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const ApprovedRequestColumnsData: ColumnDef<BorrowingRequest>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-[60px]" column={column} title='Request' />
        ),
        cell: ({ row }) => <div>{row.getValue('id')}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'requestorName',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-20" column={column} title='Requestor' />
        ),
        cell: ({ row }) => <div>{row.getValue('requestorName')}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'approverName',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-20" column={column} title='Approver' />
        ),
        cell: ({ row }) => <div>{row.getValue('approverName')}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-20" column={column} title='Requested Date' />
        ),
        cell: ({ row }) => <div>{format(row.getValue('createdAt'), "MM/dd/yyyy")}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'updatedAt',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-20" column={column} title='Approved Date' />
        ),
        cell: ({ row }) => <div>{format(row.getValue('updatedAt'), "MM/dd/yyyy")}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'statusName',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-20" column={column} title='Status' />
        ),
        cell: ({ row }) => <Badge className={`text-[12px] ${getStatusClassname(row.original.status)}`}>{row.getValue('statusName')}</Badge>,
        enableSorting: false
    }

];