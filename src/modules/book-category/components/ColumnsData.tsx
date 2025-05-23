import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { BookCategory } from "@/types/BookCategory";
import { ColumnDef } from "@tanstack/react-table";

export const ColumnsData: ColumnDef<BookCategory>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader className="w-100" column={column} title='Category Name' />
        ),
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
        enableSorting: false,
        enableHiding: false,
    }
];