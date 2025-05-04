import MainLayout from '@/components/layout/main/MainLayout';
import PermissionRoute from '@/components/routes/PermissionRoute';
import PrivateRoute from '@/components/routes/PrivateRoute';
import { BookBorrowingRequestRoutes } from '@/modules/book-borrowing-request/routers/BookBorrowingRequestRoutes';
import { BookCategoryRoutes } from '@/modules/book-category/routers/BookCategoryRoutes';
import { BookRoutes } from '@/modules/books/routers/BookRoutes';
import { DashboardRoutes } from '@/modules/dashboard/routers/DashboardRoutes';
import { ErrorRoutes } from '@/modules/errors/routers/ErrorRoutes';
import { LoginRoutes } from '@/modules/user/routers/LoginRoutes';
import { UserRoutes } from '@/modules/user/routers/UserRoutes';
import { Role } from '@/types/User';
import { createBrowserRouter } from 'react-router';


export const AppRoutes = createBrowserRouter([
  ...ErrorRoutes,
  ...LoginRoutes,
  {
    element: <PrivateRoute>
      <MainLayout />
    </PrivateRoute>,
    children: [
      ...BookRoutes,
      ...BookBorrowingRequestRoutes,
    ],
  },
  {
    element: <PrivateRoute>
      <PermissionRoute role={Role.Admin}>
        <MainLayout />
      </PermissionRoute>
    </PrivateRoute>,
    children: [
      ...DashboardRoutes,
      ...BookCategoryRoutes,
      ...UserRoutes
    ],
  },
]);


export default AppRoutes;