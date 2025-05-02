import { httpClient } from "@/lib/httpClient";
import { BookCategory } from "@/types/BookCategory";
import { DataFilter } from "@/types/filter";

const bookCategoryService = {
    getByFilter: (filter?: DataFilter) => httpClient.get<BookCategory[]>('book-categories', { params: filter }),
    getById: (id: string) => httpClient.get<BookCategory>(`book-categories/${id}`),
    create: (body: BookCategory) => httpClient.post('book-categories', body),
    update: (id: string, body: BookCategory) => httpClient.put(`/book-categories/${id}`, body),
    delete: (id: string) => httpClient.delete(`book-categories/${id}`)
};

export default bookCategoryService;