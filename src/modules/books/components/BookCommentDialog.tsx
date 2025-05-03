"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { BookRating } from "@/types/BookRating"
import { StarRating } from "./StarRating"
import bookRatingService from "../service/bookRatingService"
import { handleError, handleSuccessApi } from "@/lib/utils"
import DialogLoading from "@/components/loading/DialogLoading"

interface BookCommentDialogProps {
    book?: BookRating
    open: boolean
    onOpenChange: (open: boolean) => void,
    loading: boolean
}

export default function BookCommentDialog({ book, open, onOpenChange, loading = false }: BookCommentDialogProps) {
    const [newComment, setNewComment] = useState("")
    const [newRating, setNewRating] = useState(0)
    const [commentPermission, setCommentPermission] = useState<boolean>(false);
    const [loadingComment, setLoadingComment] = useState<boolean>(false);

    useEffect(() => {
        setLoadingComment(true)
        setNewComment("")
        setNewRating(0)
        if (book) {
            bookRatingService.getUserRight(book?.id).then(res => {
                setCommentPermission(res?.data ?? false)
            }).finally(() => setLoadingComment(false))
        }
    }, [book])

    const averageRating = book?.reviews && book.reviews.length > 0 ? book.reviews.reduce((sum, review) => sum + review.rate, 0) / book.reviews.length : 0

    const formattedAvgRating = averageRating ? averageRating.toFixed(1) : "0.0"

    const handleAddComment = () => {
        if (newComment.trim() === "" || newRating === 0) {
            handleError({ title: "Add review failure", message: "The review must have content and rating star!" })
            return
        }
        setLoadingComment(true);
        bookRatingService.create({ bookId: book!.id, comment: newComment.trim(), rate: newRating }).then(res => {
            handleSuccessApi({ title: "Add review successfully!", message: res.message })
            onOpenChange(false)
        }).finally(() => {
            setLoadingComment(false)
            setNewComment("")
            setNewRating(0)
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Book Comments</DialogTitle>
                </DialogHeader>
                {loading ? <DialogLoading /> :
                    <>
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h3 className="text-xl font-bold">{book?.title}</h3>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                <div>
                                    <span className="font-semibold">Author:</span> {book?.author}
                                </div>
                                <div>
                                    <span className="font-semibold">Category:</span> {book?.categoryName}
                                </div>
                                <div className="col-span-2">
                                    <span className="font-semibold">Available:</span>{" "}
                                    <span className={book && book?.available > 0 ? "text-green-600" : "text-red-600"}>
                                        {book?.available} copies
                                    </span>
                                </div>
                            </div>

                            {/* Average Rating */}
                            <div className="mt-3 flex items-center gap-2">
                                <span className="font-semibold">Average Rating:</span>
                                <div className="flex items-center gap-2">
                                    <StarRating rating={averageRating} />
                                    <span className="text-sm font-medium">
                                        {formattedAvgRating} ({book?.reviews?.length || 0} {book?.reviews?.length === 1 ? "review" : "reviews"})
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-semibold text-lg">User Comments</h4>

                            <div className="max-h-[200px] overflow-y-auto pr-2 space-y-3">
                                {!book?.reviews || book.reviews.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        No reviews yet!
                                    </div>
                                ) : (
                                    book.reviews.map((x) => (
                                        <div key={x.id} className="border rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <h5 className="font-medium">{x.reviewerName}</h5>
                                                <StarRating rating={x.rate} />
                                            </div>
                                            <p className="text-sm text-muted-foreground">{x.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <Separator />
                        {commentPermission && <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Add your review</h4>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <label className="block text-sm font-medium">Rating</label>
                                    <StarRating rating={newRating} interactive={true} onRatingChange={setNewRating} />
                                </div>

                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium mb-2">
                                        Comment
                                    </label>
                                    <Textarea
                                        disabled={loadingComment}
                                        id="comment"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Share your thoughts about this book..."
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <Button loading={loadingComment} onClick={handleAddComment} disabled={newComment.trim() === ""}>
                                    Submit Comment
                                </Button>
                            </div>
                        </div>}
                    </>
                }
            </DialogContent>
        </Dialog>
    )
}
