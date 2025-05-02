import FormLoading from "@/components/loading/FormLoading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { areDifferentDates, formatDate, getStatusClassname, getStatusName } from "@/lib/utils"
import { type BorrowingRequestDetails } from "@/types/BookBorrowingRequest"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle2, Clock, FileText, User, UserCheck, XCircle } from "lucide-react"

interface FormDetailProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    requestDetails?: BorrowingRequestDetails,
    onApproveRequest: () => void,
    onRefuseRequest: () => void,
    loading?: boolean,
    isDisplayConfirmButtons?: boolean
}

export default function FormDetails(props: FormDetailProps) {
    const {
        open,
        setOpen = () => { },
        requestDetails,
        onApproveRequest = () => { },
        onRefuseRequest = () => { },
        loading = false,
        isDisplayConfirmButtons = false
    } = props

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="flex flex-col w-full sm:max-w-md md:max-w-lg">
                <SheetHeader className="text-left">
                    <SheetTitle>Borrowing Request Details</SheetTitle>
                    <SheetDescription>Information about the borrowing request</SheetDescription>
                </SheetHeader>
                {loading ? <FormLoading /> : <>
                    <div className=" px-2">
                        <Card className="mb-2 p-4">
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2 col-span-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Request ID:</span>
                                        <span className="font-medium ">{requestDetails?.id}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground text-[13px]">Requester:</span>
                                        <span className="font-medium text-[13px]">{requestDetails?.requestorName}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground text-[13px]">Approver:</span>
                                        <span className="font-medium text-[13px]">{requestDetails?.approverName || "Not yet approved"}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground text-[13px]">Requested on:</span>
                                        <span className="font-medium text-[13px]">{requestDetails && format(requestDetails?.createdAt, "MM/dd/yyyy")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground text-[13px]">Status:</span>
                                        <Badge className={`text-[12px] ${getStatusClassname(requestDetails?.status)}`}>{getStatusName(requestDetails?.status)}</Badge>
                                    </div>

                                    {areDifferentDates(requestDetails?.createdAt, requestDetails?.updatedAt) && (
                                        <div className="flex items-center gap-2 md:col-span-2">
                                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Processed on:</span>
                                            <span className="font-medium">{formatDate(requestDetails?.updatedAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <h3 className="text-sm font-medium mb-3 mt-5">Requested Books ({requestDetails?.details.length})</h3>

                        <ScrollArea className="h-[calc(100vh-400px)]">
                            <div className="space-y-4 pr-4">
                                {requestDetails?.details.map((detail) => (
                                    <Card key={detail.bookId} className="p-4 bg-slate-100">
                                        <CardContent className="p-0">
                                            <div className="space-y-3">
                                                <div>
                                                    <h4 className="font-medium">{detail.bookName}</h4>
                                                    <p className="text-sm text-muted-foreground">{detail.author}</p>
                                                </div>
                                                <Separator />
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground text-[14px]">Expected return at:</span>
                                                        <span className="text-sm font-medium text-[14px]">{formatDate(detail.dueDate)}</span>
                                                    </div>

                                                    {areDifferentDates(detail.dueDate, detail.extendedDueDate) && (
                                                        <div className="flex items-center gap-2">
                                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm text-muted-foreground text-[14px]">Extended to:</span>
                                                            <span className="text-sm font-medium text-[14px]">{formatDate(detail.extendedDueDate)}</span>
                                                        </div>
                                                    )}
                                                </div>


                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>

                    </div>

                    <SheetFooter className="gap-2 pt-4 border-t">
                        {isDisplayConfirmButtons && (
                            <div className="flex gap-2">
                                <Button onClick={onRefuseRequest} className="bg-red-500 gap-1 w-full">
                                    <XCircle className="h-4 w-4" />
                                    Refuse
                                </Button>
                                <Button onClick={onApproveRequest} className="bg-green-500 gap-1  w-full">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Approve
                                </Button>
                            </div>
                        )}
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </>
                }
            </SheetContent>
        </Sheet>
    )
}
