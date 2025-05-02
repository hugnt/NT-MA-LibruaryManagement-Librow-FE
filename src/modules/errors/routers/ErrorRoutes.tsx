import { PATH } from "@/constants/paths";
import NotFoundError from "../pages/NotFoundError";
import ForbiddenError from "../pages/ForbiddenError";
import ErrorLayout from "@/components/layout/error";

export const ErrorRoutes = [
    {
        element: <ErrorLayout />,
        children: [
            { path: PATH.NotFound, element: <NotFoundError /> },
            { path: PATH.Forbidden, element: <ForbiddenError /> },
        ],
    },
];

