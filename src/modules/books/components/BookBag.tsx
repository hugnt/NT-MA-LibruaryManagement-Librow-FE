import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Book } from "@/types/Book"
import { X } from "lucide-react"
import { useEffect } from "react"
import { ReturnDatePicker } from "./ReturnDatePicker"
import { format } from "date-fns"
import { getDatePlus } from "@/lib/utils"

interface BookBagProps {
    open: boolean
    setOpen: (open: boolean) => void
    selectedBooks: Book[]
    setSelectedBooks: (selectedBooks: Book[]) => void
    onSubmitRequest: () => void
}

export default function BookBag(props: BookBagProps) {
    const {
        open,
        setOpen = () => { },
        selectedBooks = [],
        setSelectedBooks = () => { },
        onSubmitRequest = () => { },
    } = props

    useEffect(() => {
        const needsUpdate = selectedBooks.some((book) => !book.dueDate)
        if (needsUpdate) {
            const updatedBooks = selectedBooks.map((book) => {
                if (!book.dueDate) {
                    return { ...book, dueDate: format(getDatePlus(new Date(), 1), "yyyy-MM-dd") }
                }
                return book
            })

            setSelectedBooks(updatedBooks)
        }
    }, [selectedBooks, setSelectedBooks])

    const removeBook = (bookId: string) => {
        setSelectedBooks(selectedBooks.filter((book) => book.id !== bookId))
    }

    const setReturnDate = (bookId: string, date: string | undefined) => {
        if (!date) return
        setSelectedBooks(selectedBooks.map((book) => (book.id === bookId ? { ...book, dueDate: date } : book)))
    }

    const allBooksHaveDueDates = selectedBooks.length > 0 && selectedBooks.every((book) => book.dueDate)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="flex flex-col">
                <SheetHeader className="text-left">
                    <SheetTitle>Your book bag</SheetTitle>
                    <SheetDescription>Set return dates and request to borrow these books.</SheetDescription>
                </SheetHeader>

                <div className="flex-1">
                    <h3 className="text-sm font-medium mb-2 px-3">Selected Books ({selectedBooks.length})</h3>
                    {selectedBooks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">Your book bag is empty</div>
                    ) : (
                        <ScrollArea className="h-[calc(100vh-250px)] px-3">
                            <div className="space-y-4">
                                {selectedBooks.map((book) => (
                                    <div key={book.id} className="border rounded-md p-4 space-y-3 bg-slate-50">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <h4 className="font-medium">{book.title}</h4>
                                                <p className="text-sm text-muted-foreground">{book.author}</p>
                                                <Badge variant="outline" className="mt-1">
                                                    {book.categoryName}
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeBook(book.id)}
                                                aria-label={`Remove ${book.title}`}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <ReturnDatePicker
                                            date={book.dueDate}
                                            onDateChange={(date) => setReturnDate(book.id, date)}
                                            minDate={new Date(new Date().setHours(0, 0, 0, 0) + 1)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                <SheetFooter className="gap-2">
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                    <Button
                        disabled={selectedBooks.length === 0 || !allBooksHaveDueDates}
                        onClick={onSubmitRequest}>
                        Request now
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
