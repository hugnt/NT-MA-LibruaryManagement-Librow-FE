
import DataTable from "@/components/data-table/DataTable";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/context/authContext";
import { handleSuccessApi } from "@/lib/utils";
import bookBorrowingRequestService from "@/modules/book-borrowing-request/service/bookBorrowingRequestService";
import { BorrowingRequest, BorrowingRequestDetails, BorrowingRequestFilter, RequestStatus } from "@/types/BookBorrowingRequest";
import { ConfirmDialogState, confirmDialogStateDefault } from "@/types/form";
import { Role } from "@/types/User";
import { ColumnDef } from "@tanstack/react-table";
import { Check, CircleX, Eye } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { ApprovedRequestColumnsData } from "../components/ApprovedRequestColumnsData";
import { RejectedRequestColumnsData } from "../components/RejectedRequestColumnsData";
import { WaitingRequestColumnsData } from "../components/WaitingRequestColumnsData";
import FormDetails from "../components/FormDetails";

export default function BookBorrowingRequestList() {
    const { user } = useAuthContext();
    const [data, setData] = useState<BorrowingRequest[]>([]);
    const [filter, setFilter] = useState<BorrowingRequestFilter>({ pageNumber: 1, pageSize: 5, status: RequestStatus.Waiting });
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [openApproveDialog, setOpenApproveDialog] = useState<ConfirmDialogState>(confirmDialogStateDefault);
    const [openRefuseDialog, setOpenRefuseDialog] = useState<ConfirmDialogState>(confirmDialogStateDefault);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [formLoading, setFormLoading] = useState<boolean>(false);
    const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
    const [openDetails, setOpenDetails] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<BorrowingRequestDetails>();

    const columnsWaiting: ColumnDef<BorrowingRequest>[] = [
        ...WaitingRequestColumnsData,
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader className="text-center" column={column} title='Action' />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2 justify-center">
                    <Button size="sm" onClick={() => handleViewRequestDetails(row.original.id)} className="bg-gray-500 h-8 px-2 py-0">
                        <Eye size={16} />
                    </Button>
                    {user?.role == Role.Admin && <Fragment>
                        <Button onClick={() => setOpenRefuseDialog({ open: true, id: row.original.id, name: row.original.id })} size="sm" className="bg-red-500 h-8 px-2 py-0">
                            <CircleX size={14} className="mr-1" />
                            Refuse
                        </Button>
                        <Button onClick={() => setOpenApproveDialog({ open: true, id: row.original.id, name: row.original.id })} size="sm" className="bg-green-500 h-8 px-2 py-0">
                            <Check size={14} className="mr-1" />
                            Approve
                        </Button>
                    </Fragment>}
                </div>
            ),
        }
    ];

    const columsApproved: ColumnDef<BorrowingRequest>[] = [
        ...ApprovedRequestColumnsData,
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader className="text-center" column={column} title='Action' />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2 justify-center">
                    <Button size="sm" onClick={() => handleViewRequestDetails(row.original.id)} className="bg-gray-500 h-8 px-2 py-0">
                        <Eye size={16} />
                    </Button>
                </div>
            ),
        }
    ];

    const columsRefused: ColumnDef<BorrowingRequest>[] = [
        ...RejectedRequestColumnsData,
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader className="text-center" column={column} title='Action' />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2 justify-center">
                    <Button size="sm" onClick={() => handleViewRequestDetails(row.original.id)} className="bg-gray-500 h-8 px-2 py-0">
                        <Eye size={16} />
                    </Button>
                </div>
            ),
        }
    ];

    //HANDLE FORM
    const handleViewRequestDetails = (id: string) => {
        setFormLoading(true)
        bookBorrowingRequestService.getById(id).then(res => {
            setSelectedRequest(res.data)
        }).finally(() => setFormLoading(false));
        setOpenDetails(true)
    }

    //HANDLE REQUEST 
    const handleApproveRequest = () => {
        setOpenDetails(false)
        setLoadingConfirm(true);
        bookBorrowingRequestService.updateStatus(openApproveDialog.id, { status: RequestStatus.Approved }).then(res => {
            handleSuccessApi({ title: "Approve successfully!", message: res.message })
            handleGetList();
        }).finally(() => {
            setLoadingConfirm(false);
            setOpenApproveDialog({ ...openApproveDialog, open: false })
        });
    }

    const handleRefuseRequest = () => {
        setOpenDetails(false)
        setLoadingConfirm(true);
        bookBorrowingRequestService.updateStatus(openRefuseDialog.id, { status: RequestStatus.Rejected }).then(res => {
            handleSuccessApi({ title: "Refuse successfully!", message: res.message })
            handleGetList();
        }).finally(() => {
            setLoadingConfirm(false);
            setOpenApproveDialog({ ...openRefuseDialog, open: false })
        });
    }

    const handleStatusChange = (status: RequestStatus) => {
        setFilter({ ...filter, pageNumber: 1, status: status })
    }

    useEffect(() => {
        handleGetList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])

    // API HANDLER
    const handleGetList = () => {
        setTableLoading(true)
        bookBorrowingRequestService.getByFilter(filter).then(res => {
            console.log("res:", res.data)
            setData(res.data || []);
            setTotalRecords(res.totalRecords ?? 0)
        }).finally(() => setTableLoading(false));
    }

    return (
        <div>
            <PageHeader title="Book borrowing requests" subtitle="Here&apos;s a list of request" />
            <div className="space-y-2">
                <Tabs onValueChange={(v) => handleStatusChange(Number(v) as RequestStatus)}
                    defaultValue={`${RequestStatus.Waiting}`}>
                    <TabsList>
                        <TabsTrigger value={`${RequestStatus.Waiting}`}>Waiting</TabsTrigger>
                        <TabsTrigger value={`${RequestStatus.Approved}`}>Approve</TabsTrigger>
                        <TabsTrigger value={`${RequestStatus.Rejected}`}>Refuse</TabsTrigger>
                    </TabsList>
                    <TabsContent value={`${RequestStatus.Waiting}`}>
                        <DataTable data={data} columns={columnsWaiting} loading={tableLoading} />
                    </TabsContent>
                    <TabsContent value={`${RequestStatus.Approved}`}>
                        <DataTable data={data} columns={columsApproved} loading={tableLoading} />
                    </TabsContent>
                    <TabsContent value={`${RequestStatus.Rejected}`}>
                        <DataTable data={data} columns={columsRefused} loading={tableLoading} />
                    </TabsContent>
                </Tabs>
                <DataTablePagination
                    pageSizeList={[5, 8, 10]}
                    pageSize={filter?.pageSize}
                    pageNumber={filter?.pageNumber}
                    totalRecords={totalRecords}
                    onPageNumberChanged={(pageNumber: number) => setFilter({ ...filter, pageNumber: pageNumber })}
                    onPageSizeChanged={(pageSize: number) => setFilter({ ...filter, pageNumber: 1, pageSize: pageSize })} />
            </div>

            <FormDetails
                open={openDetails}
                setOpen={setOpenDetails}
                onApproveRequest={() => setOpenApproveDialog({ open: true, id: selectedRequest?.id ?? "", name: selectedRequest?.id ?? "" })}
                onRefuseRequest={() => setOpenRefuseDialog({ open: true, id: selectedRequest?.id ?? "", name: selectedRequest?.id ?? "" })}
                requestDetails={selectedRequest}
                loading={formLoading}
                isDisplayConfirmButtons={selectedRequest?.status == RequestStatus.Waiting && user?.role == Role.Admin}
            />

            <ConfirmDialog
                open={openApproveDialog.open}
                isLoading={loadingConfirm}
                onOpenChange={(v) => setOpenApproveDialog({ ...openApproveDialog, open: v })}
                handleConfirm={handleApproveRequest}
                className='max-w-md'
                classNameConfirmButton='bg-green-500'
                title={`Approve this request: ${openApproveDialog.name} ?`}
                desc={
                    <>
                        You are about to approve a request with id{' '}
                        <strong>{openApproveDialog.name}</strong>. <br />
                        This action cannot be undone.
                    </>
                }
                confirmText='Confirm' />

            <ConfirmDialog
                open={openRefuseDialog.open}
                isLoading={loadingConfirm}
                onOpenChange={(v) => setOpenRefuseDialog({ ...openRefuseDialog, open: v })}
                handleConfirm={handleRefuseRequest}
                className='max-w-md'
                classNameConfirmButton='bg-red-500'
                title={`Refuse this request: ${openRefuseDialog.name} ?`}
                desc={
                    <>
                        You are about to refuse a book with id{' '}
                        <strong>{openRefuseDialog.name}</strong>. <br />
                        This action cannot be undone.
                    </>
                }
                confirmText='Confirm' />
        </div>

    )
}


