import { createHashRouter, RouterProvider } from 'react-router-dom'
// import MainLayout from './MainLayout'
import Home from './Home'
import NotFound from './NotFound'
import MainLayout from '../components/layout/mainLayout/mainLayout'
const router = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'home',
        element: <Home />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

const AppRoutes = () => {
  return <RouterProvider router={router} />
}

export default AppRoutes
