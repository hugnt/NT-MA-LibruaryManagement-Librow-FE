import MainLayout from '@/components/layout/main';
import BookCategoryPage from '@/pages/book-category';
import Dashboard from '@/pages/dashboard';
import NotFoundError from '@/pages/errors/not-found-error';
import Login from '@/pages/login';
import { createBrowserRouter } from 'react-router';
export const pathName = {
  login: '/login',
  home: '/home',
  bookCategory: '/book-category'
};

export const AppRoutes = createBrowserRouter([
  { path: '*', element: <NotFoundError /> },
  { path: pathName.login, element: <Login /> },
  {
    element: <MainLayout />,
    children: [
      { path: pathName.home, element: <Dashboard /> },
      { path: '', element: <Dashboard /> },
      { path: pathName.bookCategory, element: <BookCategoryPage /> },
    ],
  },
]);


export default AppRoutes;