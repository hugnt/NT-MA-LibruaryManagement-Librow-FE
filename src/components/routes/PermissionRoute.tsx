import { JSX } from "react";
import { Navigate, useLocation } from "react-router";

import { Role } from "@/types/User";
import { PATH } from "@/constants/paths";
import { useAuthContext } from "@/context/authContext";

const PermissionRoute = ({ children, role }: { children: JSX.Element, role: Role }) => {
    const { user } = useAuthContext();
    const location = useLocation();
    console.log("user-in-conetxt:", user)
    console.log("role-received:", role)
    return user?.role == role ? (children) : (<Navigate to={PATH.Forbidden} state={{ from: location }} replace />)
}

export default PermissionRoute;