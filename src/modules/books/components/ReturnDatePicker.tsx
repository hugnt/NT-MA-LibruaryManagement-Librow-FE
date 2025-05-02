"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface ReturnDatePickerProps {
    date: string | undefined // Changed to string (YYYY-MM-DD format)
    onDateChange: (date: string | undefined) => void // Changed to return string
    label?: string
    placeholder?: string
    classNameButton?: string
    minDate?: Date
}

export function ReturnDatePicker({
    date,
    onDateChange,
    label = "Return Date",
    placeholder = "Select return date",
    classNameButton = "",
    minDate = new Date()
}: ReturnDatePickerProps) {
    // Convert string date to Date object for the Calendar component
    const dateObject = date ? parse(date, "yyyy-MM-dd", new Date()) : undefined
    return (
        <div className="space-y-1">
            {label && <p className="text-sm font-medium ">{label}</p>}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal mt-1", !date && "text-muted-foreground", classNameButton)}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateObject ? format(dateObject, "PPP") : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={dateObject}
                        onSelect={(selectedDate) => {
                            // Convert the selected Date to a string in YYYY-MM-DD format
                            onDateChange(selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined)
                        }}
                        initialFocus
                        disabled={(date) => date < minDate}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
