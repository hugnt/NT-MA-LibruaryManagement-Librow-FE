import { PATH } from "@/constants/paths";
import { useAuthContext } from "@/context/authContext";
import { JSX } from "react";
import { Navigate, useLocation } from "react-router";


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuthContext();
    const location = useLocation();
    return isAuthenticated ? (children) : (<Navigate to={PATH.Login} state={{ from: location }} replace />)
}

export default PrivateRoute;