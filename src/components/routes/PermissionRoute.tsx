import { JSX } from "react";
import { Navigate, useLocation } from "react-router";

import { Role } from "@/types/User";
import { PATH } from "@/constants/paths";
import { useAuthContext } from "@/context/authContext";
import PageLoading from "../loading/PageLoading";

const PermissionRoute = ({ children, role }: { children: JSX.Element, role: Role }) => {
    const { user, loading } = useAuthContext();
    const location = useLocation();
    if (loading) {
        return <PageLoading />
    }
    return user?.role == role ? children : <Navigate to={PATH.Forbidden} state={{ from: location }} replace />
}

export default PermissionRoute;