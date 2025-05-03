import { Book } from "./Book";

export type BookRatingRequest = {
    bookId: string;
    comment: string;
    rate: number;
}


export type ReviewModel = {
    id: string;
    reviewerName: string;
    comment: string;
    rate: number;
}

export type BookRating = Book & {
    reviews: ReviewModel[];
    averageRating: number;
}
