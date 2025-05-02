import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Book } from "@/types/Book";
import { ColumnDef } from "@tanstack/react-table";

export const BookColumnsData: ColumnDef<Book>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-80" column={column} title='Title' />
        ),
        cell: ({ row }) => <div>{row.getValue('title')}</div>,
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
        accessorKey: 'categoryName',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-40" column={column} title='Category' />
        ),
        cell: ({ row }) => <div>{row.getValue('categoryName')}</div>,
        enableSorting: false
    },
    {
        accessorKey: 'available',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-20" column={column} title='Available' />
        ),
        cell: ({ row }) => <Badge className={`w-10 rounded-xl ${row.getValue('available') != 0 ? "bg-green-500" : "bg-gray-500"}`}>{row.getValue('available')}</Badge>,
        enableSorting: false
    }

];