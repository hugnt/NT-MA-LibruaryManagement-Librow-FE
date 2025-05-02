import { PATH } from "@/constants/paths";
import BookBorrowingRequestList from "../pages/BookBorrowingRequestList";
import BorrowingBookList from "../pages/BorrowingBookList";

export const BookBorrowingRequestRoutes = [
    { path: PATH.BookBorrowwingRequest, element: <BookBorrowingRequestList /> },
    { path: PATH.BookBorrowwingList, element: <BorrowingBookList /> },
];

