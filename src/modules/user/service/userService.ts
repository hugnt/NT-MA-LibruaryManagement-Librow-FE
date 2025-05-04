import { httpClient } from "@/lib/httpClient";
import { DataFilter } from "@/types/filter";
import { AuditLog, User, UserRequest } from "@/types/User";

const userService = {
    getByFilter: (filter: DataFilter) => httpClient.get<User[]>('users', { params: filter }),
    getById: (id: string) => httpClient.get<User>(`users/${id}`),
    create: (body: UserRequest) => httpClient.post('users', body),
    update: (id: string, body: UserRequest) => httpClient.put(`/users/${id}`, body),
    delete: (id: string) => httpClient.delete(`users/${id}`),
    getActitviyLog: (filter: DataFilter) => httpClient.get<AuditLog[]>('users/get-activity-logs', { params: filter }),
};

export default userService;