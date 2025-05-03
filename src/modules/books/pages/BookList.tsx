
import DataTable from "@/components/data-table/DataTable";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import SearchInput from "@/components/input/SearchInput";
import PageHeader from "@/components/page/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthContext } from "@/context/authContext";
import { getMonthRange, handleError, handleSuccessApi } from "@/lib/utils";
import bookBorrowingRequestService from "@/modules/book-borrowing-request/service/bookBorrowingRequestService";
import bookCategoryService from "@/modules/book-category/service/bookCategoryService";
import { Book, BookFilter, bookFilterDefault, defaultBook } from "@/types/Book";
import { BookBorrowingRequestDetails, RequestFilterResponse } from "@/types/BookBorrowingRequest";
import { BookCategory } from "@/types/BookCategory";
import { ConfirmDialogState, confirmDialogStateDefault, FormMode, FormSetting, formSettingDefault } from "@/types/form";
import { Role } from "@/types/User";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Ban, BookmarkPlus, BookmarkX, MessageSquareText, Pencil, Plus, ShoppingBag, Trash } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import BookBag from "../components/BookBag";
import { BookColumnsData } from "../components/BookColumnsData";
import { FilterDropdown } from "../components/FilterDropdown";
import FormDetails from "../components/FormDetails";
import bookService from "../service/bookCategoryService";
import BookCommentDialog from "../components/BookCommentDialog";
import { BookRating } from "@/types/BookRating";
import bookRatingService from "../service/bookRatingService";

export default function BookList() {
    const { user } = useAuthContext();
    const [data, setData] = useState<Book[]>([]);
    const [categories, setCategories] = useState<BookCategory[]>([]);
    const [userRequestInfo, setUserRequestInfo] = useState<RequestFilterResponse>();
    const [filter, setFilter] = useState<BookFilter>(bookFilterDefault);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [formSetting, setFormSetting] = useState<FormSetting>(formSettingDefault);
    const [detail, setDetail] = useState<Book>();
    const [bookRatingDetail, setBookRatingDetail] = useState<BookRating>();
    const [openDeleteDialog, setOpenDeleteDialog] = useState<ConfirmDialogState>(confirmDialogStateDefault);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [formLoading, setFormLoading] = useState<boolean>(false);
    const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
    const [openBookBag, setOpenBookBag] = useState<boolean>(false);
    const [openCommentView, setOpenCommentView] = useState<boolean>(false);
    const [loadingComment, setLoadingComment] = useState<boolean>(false);

    const columnsAdmin: ColumnDef<Book>[] = [
        ...BookColumnsData,
        {
            accessorKey: 'quantity',
            header: ({ column }) => (
                <DataTableColumnHeader className="w-20" column={column} title='Total' />
            ),
            cell: ({ row }) => <Badge className="w-10 rounded-xl bg-blue-500">{row.getValue('quantity')}</Badge>,
            enableSorting: false
        },
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader className="text-center" column={column} title='Action' />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2 justify-center">
                    <Button onClick={() => handleFormAction(FormMode.EDIT, row)} variant="outline" size="sm" className="h-8 px-2 py-0">
                        <Pencil size={14} className="mr-1" />
                        Edit
                    </Button>
                    <Button onClick={() => setOpenDeleteDialog({ open: true, id: row.original.id, name: row.original.title })} variant="outline" size="sm" className="h-8 px-2 py-0">
                        <Trash size={14} className="mr-1" />
                        Delete
                    </Button>
                    <Button onClick={() => handleOpenRatingView(row)} size="sm" className="h-8 px-2 py-0 bg-yellow-500">
                        <MessageSquareText size={16} />
                    </Button>
                </div>
            ),
        }
    ];

    const columnsCustomer: ColumnDef<Book>[] = userRequestInfo?.totalRequest == userRequestInfo?.maxRequestPerMonth ?
        [...BookColumnsData, {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader className="text-center" column={column} title='Action' />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2 justify-center">
                    <Button onClick={() => handleOpenRatingView(row)} size="sm" className="h-8 px-2 py-0 bg-yellow-500">
                        <MessageSquareText size={16} />
                    </Button>
                </div>
            )
        }]
        : [
            {
                id: 'select',
                header: () => {
                    return <BookmarkPlus size={18} />
                },
                cell: ({ row }) => {
                    if (row.original.available == 0) return <Ban size={15} />
                    return <Checkbox
                        checked={selectedBooks.map(x => x.id).includes(row.original.id)}
                        onCheckedChange={(value) => handleSelectBook(row.original, value === true)}
                        aria-label='Select row'
                        className='translate-y-[2px]'
                    />
                },
                enableSorting: false,
                enableHiding: true,
            },
            ...BookColumnsData,
            {
                id: 'actions',
                header: ({ column }) => (
                    <DataTableColumnHeader className="text-center" column={column} title='Action' />
                ),
                cell: ({ row }) => (
                    <div className="flex space-x-2 justify-center">
                        {row.original.available == 0 ? <span className="italic">Not available</span> :
                            (
                                selectedBooks.map(x => x.id).includes(row.original.id) ?
                                    <Button onClick={() => handleSelectBook(row.original, false)} variant="outline" size="sm" className="h-8 px-2 py-0 text-red-500 border-red-500">
                                        <BookmarkX size={20} className="mr-1" />
                                        Cancel
                                    </Button> :
                                    <Button onClick={() => handleSelectBook(row.original, true)} variant="default" size="sm" className="h-8 px-2 py-0">
                                        <BookmarkPlus size={20} className="mr-1" />
                                        Borrow
                                    </Button>
                            )
                        }
                        <Button onClick={() => handleOpenRatingView(row)} size="sm" className="h-8 px-2 py-0 bg-yellow-500">
                            <MessageSquareText size={16} />
                        </Button>
                    </div>
                ),

            }
        ];

    useEffect(() => {
        bookCategoryService.getByFilter().then(res => {
            setCategories(res.data || [])
        })
        if (user?.role == Role.Customer) handleGetUserRequestInfo();
    }, [])

    useEffect(() => {
        handleGetList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])

    // API HANDLER
    const handleGetUserRequestInfo = () => {
        const { start, end } = getMonthRange(new Date());
        bookBorrowingRequestService.getUserRequestInfo({ startDate: start, endDate: end }).then(res => {
            setUserRequestInfo(res.data)
        })
    }

    const handleGetList = () => {
        setTableLoading(true)
        bookService.getByFilter(filter).then(res => {
            console.log("res:", res.data)
            setData(res.data || []);
            setTotalRecords(res.totalRecords ?? 0)
        }).finally(() => setTableLoading(false));
    }

    //FORM HANDLER
    const handleFormAction = (mode: FormMode, row?: Row<Book>) => {
        setFormLoading(true);
        if (mode == FormMode.ADD) {
            setDetail(defaultBook);
            setFormLoading(false);
        }
        else if (row && mode == FormMode.EDIT) {
            const id = row.original.id;
            bookService.getById(id).then(res => {
                setDetail(res.data);
            }).then(() => setFormLoading(false));
        }
        setFormSetting({
            mode: mode,
            open: true
        })
    }

    const handleFormSubmit = (data: Book) => {
        console.log("updated-data:", data)
        if (formSetting.mode == FormMode.ADD) {
            bookService.create(data).then(res => {
                handleSuccessApi({ title: "Insert successfully!", message: res.message })
                handleGetList();
            });
        }
        else if (formSetting.mode == FormMode.EDIT) {
            bookService.update(detail!.id, data).then(res => {
                handleSuccessApi({ title: "Updated successfully!", message: res.message })
                handleGetList();
            });
        }
        setFormSetting({ ...formSetting, open: false })
    }

    //DELETE HANDLER
    const handleConfirmDelete = () => {
        bookService.delete(openDeleteDialog.id).then(res => {
            handleSuccessApi({ title: "Deleted successfully!", message: res.message })
            handleGetList();
        });
        setOpenDeleteDialog({ ...openDeleteDialog, open: false })
    }

    // BORROWING ACTION
    const handleSubmitBorrowingRequest = () => {
        const bookBorrowingRequest: BookBorrowingRequestDetails = {
            details: selectedBooks.map(x => ({
                bookId: x.id,
                dueDate: x.dueDate
            }))
        }
        console.log("Requested books:", bookBorrowingRequest)
        setFormLoading(true);
        bookBorrowingRequestService.create(bookBorrowingRequest).then(res => {
            handleSuccessApi({ title: "Requested successfully!", message: res.message });
            handleGetUserRequestInfo();
            handleGetList();
        }).finally(() => {
            setFormLoading(false)
            setOpenBookBag(false);
            setSelectedBooks([]);
        })
    }

    const handleSelectBook = (book: Book, isAdd: boolean) => {
        if (isAdd) {
            if (selectedBooks.length == 5) {
                handleError({ title: "Borrowing error", message: "Book borrowing must not over 5 book for each request!" })
            }
            else setSelectedBooks([...selectedBooks, book])

        }
        else {
            setSelectedBooks(selectedBooks.filter(x => x.id !== book.id))
        }
    }

    //COMMENT & RATING
    const handleOpenRatingView = (row?: Row<Book>) => {
        if (!row) return;
        setLoadingComment(true)
        const book = row.original;
        bookRatingService.getByBookId(book.id).then(res => {
            const bookInfo: BookRating = { ...res.data! };
            bookInfo.id = book.id;
            bookInfo.title = book.title;
            bookInfo.author = book.author;
            bookInfo.categoryName = book.categoryName;
            bookInfo.available = book.available;
            setBookRatingDetail(bookInfo);
        }).finally(() => setLoadingComment(false))
        setOpenCommentView(true);
    }

    //SEARCH & FILTER
    const handleSearch = (query: string) => {
        setFilter({ ...filter, searchValue: query })
    };
    const handleCategoryChange = (value: string) => {
        const categoryId = value === "all" ? undefined : value;
        setFilter({ ...filter, categoryId: categoryId })
    };
    const handleFilters = (newFilters: { availability: [number, number], rating: [number, number] }) => {
        setFilter({
            ...filter,
            minAvailable: newFilters.availability[0],
            maxAvailable: newFilters.availability[1],
            minRating: newFilters.rating[0],
            maxRating: newFilters.rating[1],
        })
    }

    return (
        <div>
            <PageHeader title="Books list" subtitle="Here&apos;s a list of category">
                {
                    user?.role == Role.Customer &&
                    <Fragment>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-100 px-3 py-2 shadow-sm">
                            <div className="text-sm leading-tight text-slate-700">
                                <div className="font-medium">Your request</div>
                                <div className="text-xs text-slate-500">in this month</div>
                            </div>
                            <span className="text-[16px] font-semibold text-blue-600">({userRequestInfo?.totalRequest}/{userRequestInfo?.maxRequestPerMonth})</span>
                        </div>
                        <Button onClick={() => setOpenBookBag(true)} className='relative bg-green-500 flex flex-col py-6'>
                            <div><ShoppingBag /></div>
                            {selectedBooks.length > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center text-white
                                rounded-full bg-destructive text-[12px] font-medium text-destructive-foreground">
                                    {selectedBooks.length}
                                </span>
                            )}
                            <div>Basket</div>
                        </Button>
                    </Fragment>
                }
                {
                    user?.role == Role.Admin && <Button onClick={() => handleFormAction(FormMode.ADD)} className='space-x-1'>
                        <span>Create</span><Plus size={18} />
                    </Button>
                }
            </PageHeader>
            <div className="flex space-x-3">
                <SearchInput onSearch={handleSearch} />
                <Select defaultValue={"all"} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select request status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Category</SelectLabel>
                            <SelectItem value="all">All</SelectItem>
                            {
                                categories?.map(x => {
                                    return <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>
                                })
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div>
                    <FilterDropdown
                        availableRange={[0, 50]}
                        defaultAvailableValue={[0, 50]}
                        defaultRatingValue={[0, 5]}
                        onApplyFilters={handleFilters}
                    />
                </div>
            </div>
            <div className='space-y-4'>
                <DataTable onDataSelected={setSelectedBooks} data={data} columns={user?.role == Role.Admin ? columnsAdmin : columnsCustomer} loading={tableLoading} />
                <DataTablePagination
                    selectedRows={selectedBooks.length}
                    isDisplaySelectedRows={true}
                    pageSizeList={[5, 8, 10]}
                    pageSize={filter?.pageSize}
                    pageNumber={filter?.pageNumber}
                    totalRecords={totalRecords}
                    onPageNumberChanged={(pageNumber: number) => setFilter({ ...filter, pageNumber: pageNumber })}
                    onPageSizeChanged={(pageSize: number) => setFilter({ ...filter, pageNumber: 1, pageSize: pageSize })} />
            </div>
            <FormDetails
                title="Book"
                categories={categories}
                loading={formLoading}
                data={detail}
                onSubmit={handleFormSubmit}
                formSetting={formSetting}
                setFormSetting={setFormSetting} />

            <BookBag
                open={openBookBag}
                setOpen={setOpenBookBag}
                selectedBooks={selectedBooks}
                setSelectedBooks={setSelectedBooks}
                onSubmitRequest={handleSubmitBorrowingRequest}
                loading={formLoading}
            />

            <BookCommentDialog
                book={bookRatingDetail}
                open={openCommentView}
                onOpenChange={setOpenCommentView}
                loading={loadingComment} />

            <ConfirmDialog
                destructive
                open={openDeleteDialog.open}
                onOpenChange={(v) => setOpenDeleteDialog({ ...openDeleteDialog, open: v })}
                handleConfirm={handleConfirmDelete}
                className='max-w-md'
                title={`Delete this book: ${openDeleteDialog.name} ?`}
                desc={
                    <>
                        You are about to delete a book with the name{' '}
                        <strong>{openDeleteDialog.name}</strong>. <br />
                        This action cannot be undone.
                    </>
                }
                confirmText='Delete' />
        </div>

    )
}
