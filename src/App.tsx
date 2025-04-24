import { RouterProvider } from 'react-router'
import AppRoutes from './routes'

function App() {

  return (
    <>
      <RouterProvider router={AppRoutes}/>
    </>
  )
}

export default App
