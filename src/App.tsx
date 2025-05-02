import { RouterProvider } from 'react-router'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'
import AuthProvider from './context/authContext'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={AppRoutes} />
      <ToastContainer autoClose={2000} />
    </AuthProvider>
  )
}

export default App
