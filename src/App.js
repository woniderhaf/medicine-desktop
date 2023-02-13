import './App.css';
// import socket from './socket/socket';
import {createBrowserRouter,Link,Navigate,RouterProvider, BrowserRouter} from 'react-router-dom'
import CreateRoom from './pages/CreateRoom/Index';
import Room from './pages/Room/Index';
import ErrorPage from './pages/ErrorPage/Index'
function App() {
  const router = createBrowserRouter([
    {
      path:'/',
      element: <CreateRoom/>
    },
    {
      path:'/room/:id',
      element: <Room/>
    },
    {
      path:'/notFound',
      element: <ErrorPage/>
    },
    {
      path:'*',
      element: <Navigate to={'/'}/>
    }
  ])
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
