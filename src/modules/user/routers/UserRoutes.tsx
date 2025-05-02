import { PATH } from "@/constants/paths";
import ActivityLog from "../pages/ActivityLog";
import UserList from "../pages/UserList";

export const UserRoutes = [
    { path: PATH.UserAccountList, element: <UserList /> },
    { path: PATH.UserActivityLog, element: <ActivityLog /> },
];

