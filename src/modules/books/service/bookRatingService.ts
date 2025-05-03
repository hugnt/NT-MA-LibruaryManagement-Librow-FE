import { httpClient } from "@/lib/httpClient";
import { BookRating, BookRatingRequest } from "@/types/BookRating";

const bookRatingService = {
    getByBookId: (bookId: string) => httpClient.get<BookRating>(`book-ratings/${bookId}`),
    getUserRight: (bookId: string) => httpClient.get<boolean>(`book-ratings/${bookId}/user-rights`),
    create: (body: BookRatingRequest) => httpClient.post('book-ratings', body),
};

export default bookRatingService;