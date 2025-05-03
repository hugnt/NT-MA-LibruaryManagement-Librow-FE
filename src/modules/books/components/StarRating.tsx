"use client"

import { Star, StarHalf } from "lucide-react"
import { useState } from "react"

interface StarRatingProps {
    rating: number
    interactive?: boolean
    onRatingChange?: (rating: number) => void
    size?: "sm" | "md" | "lg"
}

export function StarRating({ rating, interactive = false, onRatingChange, size = "md" }: StarRatingProps) {
    const [hoveredRating, setHoveredRating] = useState(0)

    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    }

    const activeRating = interactive ? hoveredRating || rating : rating

    const renderStars = () => {
        const stars = []

        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(activeRating)) {
                // Full star
                stars.push(
                    <Star
                        key={i}
                        className={`${sizeClasses[size]} ${interactive ? "cursor-pointer fill-primary" : "fill-primary"}`}
                        onClick={interactive ? () => onRatingChange?.(i) : undefined}
                        onMouseEnter={interactive ? () => setHoveredRating(i) : undefined}
                        onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
                    />,
                )
            } else if (i === Math.ceil(activeRating) && activeRating % 1 !== 0) {
                // Half star
                stars.push(
                    <StarHalf
                        key={i}
                        className={`${sizeClasses[size]} ${interactive ? "cursor-pointer fill-primary" : "fill-primary"}`}
                        onClick={interactive ? () => onRatingChange?.(i) : undefined}
                        onMouseEnter={interactive ? () => setHoveredRating(i) : undefined}
                        onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
                    />,
                )
            } else {
                // Empty star
                stars.push(
                    <Star
                        key={i}
                        className={`${sizeClasses[size]} ${interactive ? "cursor-pointer stroke-primary" : "stroke-muted-foreground"
                            }`}
                        onClick={interactive ? () => onRatingChange?.(i) : undefined}
                        onMouseEnter={interactive ? () => setHoveredRating(i) : undefined}
                        onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
                    />,
                )
            }
        }

        return stars
    }

    return <div className="flex gap-1">{renderStars()}</div>
}
