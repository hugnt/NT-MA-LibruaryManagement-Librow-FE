import { httpClient } from "@/lib/httpClient";
import { Book, BookFilter } from "@/types/Book";

const bookService = {
    getByFilter: (filter: BookFilter) => httpClient.get<Book[]>('books', { params: filter }),
    getById: (id: string) => httpClient.get<Book>(`books/${id}`),
    create: (body: Book) => httpClient.post('books', body),
    update: (id: string, body: Book) => httpClient.put(`/books/${id}`, body),
    delete: (id: string) => httpClient.delete(`books/${id}`)
};

export default bookService;