import { format } from "date-fns";
import { DataFilter } from "./filter";


export type Book = {
    id: string;
    categoryId: string;
    categoryName: string;
    title: string;
    author: string;
    quantity: number;
    available: number;
    dueDate: string;
}

export const defaultBook: Book = {
    id: "",
    categoryId: "",
    categoryName: "",
    title: "",
    author: "",
    quantity: 0,
    available: 0,
    dueDate: format(new Date(), "yyyy-MM-dd")
};

export type BookFilter = DataFilter & {
    minAvailable: number;
    maxAvailable: number;
    minRating: number;
    maxRating: number;
    categoryId?: string;
}

export const bookFilterDefault: BookFilter = {
    pageSize: 10,
    pageNumber: 1,
    totalRecords: 0,
    minAvailable: 0,
    maxAvailable: -1,
    minRating: 0,
    maxRating: 5
}
