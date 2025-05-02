import { httpClient } from "@/lib/httpClient";
import { BookBorrowingRequestDetails, BorrowingBook, BorrowingRequest, BorrowingRequestDetails, BorrowingRequestFilter, ExtendBorrowingRequest, RequestFilter, RequestFilterResponse, UpdateBorrowingStatusRequest, UpdateStatusRequest } from "@/types/BookBorrowingRequest";
import { DataFilter } from "@/types/filter";

const bookBorrowingRequestService = {
    getByFilter: (filter: BorrowingRequestFilter) => httpClient.get<BorrowingRequest[]>('book-borrowing-requests', { params: filter }),
    getBorrowingBookByFilter: (filter: DataFilter) => httpClient.get<BorrowingBook[]>('book-borrowing-requests/all-borrowing-books', { params: filter }),
    getUserRequestInfo: (filter: RequestFilter) => httpClient.get<RequestFilterResponse>('book-borrowing-requests/user-request-info', { params: filter }),
    create: (body: BookBorrowingRequestDetails) => httpClient.post('book-borrowing-requests', body),
    getById: (id: string) => httpClient.get<BorrowingRequestDetails>(`book-borrowing-requests/${id}`),
    updateStatus: (id: string, body: UpdateStatusRequest) => httpClient.patch(`book-borrowing-requests/update-status/${id}`, body),
    updateDueDate: (id: string, body: ExtendBorrowingRequest) => httpClient.patch(`book-borrowing-requests/details/${id}/extend-due-date`, body),
    updateBookBorrowingStatus: (id: string, body: UpdateBorrowingStatusRequest) => httpClient.patch(`book-borrowing-requests/details/${id}/extend-due-date}`, body),
};

export default bookBorrowingRequestService;