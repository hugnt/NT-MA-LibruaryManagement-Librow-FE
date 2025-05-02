
import DataTable from "@/components/data-table/DataTable";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { areDifferentDates, getDatePlus, getMaxDateString, handleSuccessApi } from "@/lib/utils";
import { BorrowingBook } from "@/types/BookBorrowingRequest";
import { DataFilter } from "@/types/filter";
import { ColumnDef } from "@tanstack/react-table";
import { parseISO } from "date-fns";
import { CalendarArrowUp, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { BorrowingBookColumnsData } from "../components/BorrowingBookColumnsData";
import { ExtendDueDateDialog } from "../components/ExtendDueDateDialog";
import bookBorrowingRequestService from "../service/bookBorrowingRequestService";
import { useAuthContext } from "@/context/authContext";
import { Role } from "@/types/User";


export default function BorrowingBookList() {
    const { user } = useAuthContext();
    const [data, setData] = useState<BorrowingBook[]>([]);
    const [filter, setFilter] = useState<DataFilter>({ pageNumber: 1, pageSize: 5 });
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [detail, setDetails] = useState<BorrowingBook>();
    const [openDetails, setOpenDetails] = useState<boolean>(false);
    const [formLoading, setFormLoading] = useState<boolean>(false);
    const [formEditable, setFormEditable] = useState<boolean>(false);

    const columns: ColumnDef<BorrowingBook>[] = [
        ...BorrowingBookColumnsData,
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader className="text-center" column={column} title='Action' />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-3 justify-end items-center">
                    {user?.role === Role.Customer && !areDifferentDates(row.original.dueDate, row.original.extendedDueDate) && (
                        <Button onClick={() => handleViewBookDetails(row.original, true)} size="sm" className="bg-blue-500 h-8 px-2 py-0">
                            <CalendarArrowUp size={20} className="mr-1" />
                            Extend
                        </Button>
                    )}
                    {(user?.role === Role.Admin || areDifferentDates(row.original.dueDate, row.original.extendedDueDate)) && (
                        <span className="text-[14px] italic text-slate-600">
                            Extended ({areDifferentDates(row.original.dueDate, row.original.extendedDueDate) ? '1/1' : '0/1'})
                        </span>
                    )}
                    <Button size="sm" onClick={() => handleViewBookDetails(row.original)} className="bg-gray-500 h-8 px-2 py-0">
                        <Eye size={16} />
                    </Button>
                </div>
            ),
        }
    ];

    useEffect(() => {
        handleGetList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])

    //HANDLE FORM
    const handleViewBookDetails = (book: BorrowingBook, editable: boolean = false) => {
        setFormEditable(editable)
        let bookDetails = { ...book }
        if (editable) {
            bookDetails = { ...book, extendedDueDate: getMaxDateString(getDatePlus(parseISO(book.extendedDueDate), 1), getDatePlus(new Date, 1)) }
        }
        setDetails(bookDetails)
        setOpenDetails(true)
    }

    // API HANDLER
    const handleGetList = () => {
        setTableLoading(true)
        bookBorrowingRequestService.getBorrowingBookByFilter(filter).then(res => {
            console.log("res:", res.data)
            setData(res.data || []);
            setTotalRecords(res.totalRecords ?? 0)
        }).finally(() => setTableLoading(false));
    }

    const handleConfirmExtendDate = () => {
        if (!detail) return;
        setFormLoading(true)
        bookBorrowingRequestService.updateDueDate(detail?.requestDetailsId, { extendedDueDate: detail.extendedDueDate }).then(res => {
            handleSuccessApi({ title: "Extended successfully!", message: res.message })
            handleGetList();
        }).finally(() => setFormLoading(false))
        setOpenDetails(false);
    }



    return (
        <div>
            <PageHeader title="Borrowing books" subtitle="Here&apos;s a list of books have been borrowed" />
            <div className='space-y-4'>
                <DataTable data={data} columns={columns} loading={tableLoading} />
                <DataTablePagination
                    pageSizeList={[5, 8, 10]}
                    pageSize={filter?.pageSize}
                    pageNumber={filter?.pageNumber}
                    totalRecords={totalRecords}
                    onPageNumberChanged={(pageNumber: number) => setFilter({ ...filter, pageNumber: pageNumber })}
                    onPageSizeChanged={(pageSize: number) => setFilter({ pageNumber: 1, pageSize: pageSize })} />
            </div>
            <ExtendDueDateDialog
                loading={formLoading}
                updatable={formEditable}
                open={openDetails}
                setOpen={setOpenDetails}
                data={detail}
                setData={setDetails}
                onConfirmExtend={handleConfirmExtendDate}
            />
        </div>

    )
}
