import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { areDifferentDates, formatDate } from "@/lib/utils";
import { BorrowingBook } from "@/types/BookBorrowingRequest";
import { ColumnDef } from "@tanstack/react-table";

export const BorrowingBookColumnsData: ColumnDef<BorrowingBook>[] = [
    {
        accessorKey: 'bookName',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-60" column={column} title='Title' />
        ),
        cell: ({ row }) => <div>{row.getValue('bookName')}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'author',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-40" column={column} title='Author' />
        ),
        cell: ({ row }) => <div>{row.getValue('author')}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'requestId',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-40" column={column} title='Request' />
        ),
        cell: ({ row }) => <div>{row.getValue('requestId')}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'dueDate',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-40" column={column} title='Due date' />
        ),
        cell: ({ row }) => <div>{formatDate(row.getValue('dueDate'))}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'extendedDueDate',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-40" column={column} title='Extended date' />
        ),
        cell: ({ row }) => <div>{areDifferentDates(row.original.dueDate, row.original.extendedDueDate) ? formatDate(row.getValue('extendedDueDate')) : "Not extended yet"}</div>,
        enableSorting: false
    },

];