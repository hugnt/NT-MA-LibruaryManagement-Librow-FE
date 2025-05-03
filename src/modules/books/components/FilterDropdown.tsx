import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { SliderInput } from "@/components/input/SliderInput"

interface FilterDropdownProps {
    availableRange: [number, number]
    defaultAvailableValue?: [number, number]
    defaultRatingValue?: [number, number]
    onApplyFilters?: (filters: {
        availability: [number, number]
        rating: [number, number]
    }) => void
    className?: string
}

export function FilterDropdown({
    availableRange = [0, 48],
    defaultAvailableValue = [0, 48],
    defaultRatingValue = [0, 5],
    onApplyFilters,
    className,
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [availableValue, setAvailableValue] = useState<[number, number]>(defaultAvailableValue)
    const [ratingValue, setRatingValue] = useState<[number, number]>(defaultRatingValue)
    const [appliedFilters, setAppliedFilters] = useState({
        availability: defaultAvailableValue,
        rating: defaultRatingValue,
    })

    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleAvailabilityChange = (value: [number, number]) => {
        setAvailableValue(value)
    }

    const handleRatingChange = (value: [number, number]) => {
        setRatingValue(value)
    }

    const handleApplyFilters = () => {
        const filters = {
            availability: availableValue,
            rating: ratingValue,
        }

        setAppliedFilters(filters)
        onApplyFilters?.(filters)
        setIsOpen(false)
    }

    // Check if filters are active (different from full range)
    const isAvailabilityFiltered =
        appliedFilters.availability[0] !== availableRange[0] || appliedFilters.availability[1] !== availableRange[1]

    const isRatingFiltered = appliedFilters.rating[0] !== 0 || appliedFilters.rating[1] !== 5

    const activeFilterCount = (isAvailabilityFiltered ? 1 : 0) + (isRatingFiltered ? 1 : 0)

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <Button
                variant="outline"
                className={cn(
                    "flex items-center gap-2 border border-gray-200 dark:border-gray-800",
                    (isAvailabilityFiltered || isRatingFiltered) && "border-primary text-primary",
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs">
                        {activeFilterCount}
                    </span>
                )}
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </Button>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 space-y-4">
                    <div className="space-y-4">
                        <div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Availability</div>
                            <SliderInput
                                className="w-full"
                                defaultValue={availableValue}
                                min={availableRange[0]}
                                max={availableRange[1]}
                                step={1}
                                value={availableValue}
                                onValueChange={handleAvailabilityChange}
                                formatLabel={(value) => `${value}`}
                            />
                        </div>

                        <div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</div>
                            <SliderInput
                                className="w-full"
                                defaultValue={ratingValue}
                                min={0}
                                max={5}
                                step={1}
                                value={ratingValue}
                                onValueChange={handleRatingChange}
                                formatLabel={(value) => `${value}`}
                            />
                        </div>
                    </div>

                    <Button className="w-full" onClick={handleApplyFilters}>
                        Apply Filters
                    </Button>
                </div>
            )}
        </div>
    )
}
