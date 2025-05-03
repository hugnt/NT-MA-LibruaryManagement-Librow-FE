import { DataFilter } from "./filter";

// Type cho RequestStatus (giả định từ C#)
export enum RequestStatus {
    Waiting = 0,
    Approved = 1,
    Rejected = 2,
}

export enum BorrowingStatus {
    None = 0,
    Borrowing = 1,
    Returned = 2,
    Overdue = 3
}

export interface BorrowingRequestFilter extends DataFilter {
    status?: RequestStatus;
};

export type BorrowingDetailsRequest = {
    bookId: string;
    dueDate: string;
};

export type BookBorrowingRequestDetails = {
    details: BorrowingDetailsRequest[];
};

export type ExtendBorrowingRequest = {
    extendedDueDate: string;
};

export type UpdateStatusRequest = {
    status: RequestStatus;
};

export type UpdateBorrowingStatusRequest = {
    status: BorrowingStatus;
};


export type BorrowingRequest = {
    id: string;
    requestorName: string;
    approverName: string;
    status: RequestStatus;
    createdAt: Date;
    updatedAt: Date;
};


export type BorrowingDetails = {
    id: string;
    bookId: string;
    bookName: string;
    author: string;
    dueDate: Date;
    extendedDueDate: Date;
};


export type BorrowingRequestDetails = BorrowingRequest & {
    details: BorrowingDetails[];
};


export type BorrowingBook = {
    requestId: string;
    requestDetailsId: string;
    bookId: string;
    bookName: string;
    author: string;
    dueDate: string;
    extendedDueDate: string;
    bookStatus: BorrowingStatus,
    requestStatus: RequestStatus
}

export type RequestFilter = {
    startDate: string;
    endDate: string;
};

export type RequestFilterResponse = {
    totalRequest: number;
    maxRequestPerMonth: number;
};