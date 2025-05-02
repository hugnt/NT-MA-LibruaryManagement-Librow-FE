import { CreateAxiosDefaults } from "axios";

export const ROOT_API: CreateAxiosDefaults = {
    baseURL: "http://localhost:5255/api",
    headers: {
        'Content-type': 'application/json',
    }
}