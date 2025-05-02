import { httpClient } from "@/lib/httpClient";
import { Book } from "@/types/Book";
import { DataFilter } from "@/types/filter";

const bookService = {
    getByFilter: (filter: DataFilter) => httpClient.get<Book[]>('books', { params: filter }),
    getById: (id: string) => httpClient.get<Book>(`books/${id}`),
    create: (body: Book) => httpClient.post('books', body),
    update: (id: string, body: Book) => httpClient.put(`/books/${id}`, body),
    delete: (id: string) => httpClient.delete(`books/${id}`)
};

export default bookService;