import { PATH } from "@/constants/paths";
import Login from "../pages/Login";
import LoginLayout from "@/components/layout/login";
import Register from "../pages/Register";

export const LoginRoutes = [
    {
        element: <LoginLayout />,
        children: [
            { path: PATH.Login, element: <Login /> },
            { path: PATH.Register, element: <Register /> },
        ],
    },
];

