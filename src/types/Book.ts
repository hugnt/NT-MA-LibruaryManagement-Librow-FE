import { format } from "date-fns";


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
