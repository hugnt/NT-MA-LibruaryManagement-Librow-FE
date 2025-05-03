"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { areDifferentDates, getDatePlus, getMaxDate, getStatusClassname, getStatusName } from "@/lib/utils"
import { ReturnDatePicker } from "@/modules/books/components/ReturnDatePicker"
import { BorrowingBook } from "@/types/BookBorrowingRequest"
import { format, parseISO } from "date-fns"
import { BookOpen } from "lucide-react"

// Define the BorrowingBook type since we don't have access to the original
interface ExtendDueDateDialog {
    open: boolean
    setOpen: (open: boolean) => void
    data?: BorrowingBook
    setData: (data?: BorrowingBook) => void
    loading?: boolean
    onConfirmExtend: () => void
    editable?: boolean
}

export function ExtendDueDateDialog(props: ExtendDueDateDialog) {
    const { open = false, setOpen = () => { }, data, setData = () => { }, loading = false, onConfirmExtend = () => { }, editable = false } = props;
    const setExtendDate = (date: string | undefined) => {
        if (!date || !data) return
        const updatedData: BorrowingBook = { ...data, extendedDueDate: date }
        setData(updatedData)
    }


    if (!data) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">{editable ? "Extend Return Date" : "Details"}</DialogTitle>
                    <DialogDescription>{editable ? "You can only extend the return date of the book once." : "Information about your borrowed books"}</DialogDescription>
                </DialogHeader>
                <Card className="border-muted p-4 bg-slate-100">
                    <CardContent className="p-0">
                        <h3 className="font-medium text-base mb-3 flex items-center">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Book Information
                        </h3>

                        <div className="grid gap-2 text-sm">
                            <div className="grid grid-cols-3 items-center">
                                <Label className="text-muted-foreground">Title:</Label>
                                <span className="col-span-2 font-medium">{data.bookName}</span>
                            </div>

                            <div className="grid grid-cols-3 items-center">
                                <Label className="text-muted-foreground">Author:</Label>
                                <span className="col-span-2">{data.author}</span>
                            </div>

                            <div className="grid grid-cols-3 items-center">
                                <Label className="text-muted-foreground">Request ID:</Label>
                                <span className="col-span-2 text-xs font-mono">{data.requestId}</span>
                            </div>

                            <div className="grid grid-cols-3 items-center">
                                <Label className="text-muted-foreground">Request Status:</Label>
                                <Badge className={`text-[12px] ${getStatusClassname(data.requestStatus)}`}>{getStatusName(data.requestStatus)}</Badge>
                            </div>

                            <div className="grid grid-cols-3 items-center">
                                <Label className="text-muted-foreground">Due Date:</Label>
                                <span className="col-span-2">{format(new Date(data.dueDate), "MM/dd/yyyy")}</span>
                            </div>

                            {!editable && areDifferentDates(data.extendedDueDate, data.dueDate) && <div className="grid grid-cols-3 items-center">
                                <Label className="text-muted-foreground">Extende due date:</Label>
                                <span className="col-span-2">{format(new Date(data.extendedDueDate), "MM/dd/yyyy")}</span>
                            </div>}
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-1">
                    {editable && <ReturnDatePicker
                        label="Select Extended Date"
                        classNameButton="bg-green-200"
                        date={data.extendedDueDate}
                        onDateChange={setExtendDate}
                        minDate={getMaxDate(getDatePlus(new Date(), 1), getDatePlus(parseISO(data.dueDate), 1))}
                    />}
                </div>

                <DialogFooter className="mt-1">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    {editable && <Button loading={loading} onClick={onConfirmExtend} disabled={loading || !data.extendedDueDate}>
                        Confirm Extension
                    </Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
