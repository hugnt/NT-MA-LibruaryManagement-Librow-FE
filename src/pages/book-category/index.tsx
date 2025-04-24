
import PageHeader from "@/components/page/page-header";
import DataTable from "@/components/table/data-table";
import DataTableColumnHeader from "@/components/table/data-table-column-header";
import DataTablePagination from "@/components/table/data-table-pagination";
import { Button } from "@/components/ui/button";
import { BookCategory, bookCategoryDefault } from "@/types/BookCategory.type";
import { FormSetting, formSettingDefault, FormMode } from "@/types/common";
import { DataFilter } from "@/types/DataFilter.type";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Delete, Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import FormDetail from "./form-detail";
import { ConfirmDialog } from "@/components/confirm-dialog";

const dataTest: BookCategory[] = [
  {
    id: "82389012904h90d93209",
    name: "Karate"
  },
  {
    id: "1231jksdfijsdf990239",
    name: "Fiction"
  },
  {
    id: "234293490jsdfiojsdf",
    name: "Theory"
  }
]

const columnsData: ColumnDef<BookCategory>[] = [
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

export default function BookCategoryPage() {
  const [data, setData] = useState<BookCategory[]>([]);
  const [filter, setFilter] = useState<DataFilter>();
  const [formSetting, setFormSetting] = useState<FormSetting>(formSettingDefault);
  const [detail, setDetail] = useState<BookCategory>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<{ open: boolean, id: string }>({ open: false, id: '' });

  const columns: ColumnDef<BookCategory>[] = [
    ...columnsData,
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader className="text-end mr-22" column={column} title='Action' />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2 justify-end">
          <Button onClick={() => handleFormAction(FormMode.EDIT, row)} variant="outline" size="sm" className="h-8 px-2 py-0">
            <Pencil size={14} className="mr-1" />
            Edit
          </Button>
          <Button onClick={() => setOpenDeleteDialog({ open: true, id: row.original.id })} variant="outline" size="sm" className="h-8 px-2 py-0">
            <Trash size={14} className="mr-1" />
            Delete
          </Button>
        </div>
      ),
    }
  ];

  useEffect(() => {
    setData(dataTest);
  }, [filter])

  //FORM HANDLER
  const handleFormAction = (mode: FormMode, row?: Row<BookCategory>) => {
    if (mode == FormMode.ADD) {
      setDetail(bookCategoryDefault);
    }
    else if (row && mode == FormMode.EDIT) {
      const id = row.original.id;
      //call api gat by id
      const selectedData = data?.find(x => x.id == id);
      setDetail(selectedData);
    }
    setFormSetting({
      mode: mode,
      open: true
    })
  }

  const handleFormSubmit = (data: BookCategory) => {
    if (data) {
      console.log("UPDATE OR ADD", data)
    }
  }

  //DELETE HANDLER
  const handleConfirmDelete = () => {
    setOpenDeleteDialog({ ...openDeleteDialog, open: false })
  }

  return (
    <div>
      <PageHeader title="Book Category" subtitle="Here&apos;s a list of category">
        <Button onClick={() => handleFormAction(FormMode.ADD)} className='space-x-1'>
          <span>Create</span><Plus size={18} />
        </Button>
      </PageHeader>
      <div className='space-y-4'>
        <DataTable data={data} columns={columns} />
        <DataTablePagination
          pageSize={filter?.pageSize}
          pageNumber={filter?.pageNumber}
          totalRecords={filter?.totalRecords}
          onPageNumberChanged={(pageNumber: number) => setFilter({ ...filter, pageNumber: pageNumber })}
          onPageSizeChanged={(pageSize: number) => setFilter({ ...filter, pageSize: pageSize })} />
      </div>
      <FormDetail
        title="Book Category"
        data={detail}
        onSubmit={handleFormSubmit}
        formSetting={formSetting}
        setFormSetting={setFormSetting} />

      <ConfirmDialog
          destructive
          open={openDeleteDialog.open}
          onOpenChange={(v) => setOpenDeleteDialog({ ...openDeleteDialog, open: v })}
          handleConfirm={handleConfirmDelete}
          className='max-w-md'
          title={`Delete this category: ${detail?.id} ?`}
          desc={
            <>
              You are about to delete a category with the ID{' '}
              <strong>{detail?.id}</strong>. <br />
              This action cannot be undone.
            </>
          }
          confirmText='Delete'/>
    </div>

  )
}
