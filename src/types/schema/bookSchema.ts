import { z } from 'zod';

export const BookSchema = z.object({
    id: z.string(),
    categoryId: z.string()
        .nonempty({ message: "Category ID is required." }),  // Ensures it's not empty or null
    categoryName: z.string(),
    title: z.string()
        .min(1, { message: "Title is required." })
        .max(255, { message: "Title must not exceed 255 characters." }),
    author: z.string()
        .min(1, { message: "Author is required." })
        .max(255, { message: "Author must not exceed 255 characters." }),
    quantity: z.number()
        .gte(0, { message: "Quantity must be greater than or equal to 0." }),
    available: z.number(),
    dueDate: z.string().optional(),
});