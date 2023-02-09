import './App.css';
// import socket from './socket/socket';
import {createBrowserRouter,Link,Navigate,RouterProvider, BrowserRouter} from 'react-router-dom'
import CreateRoom from './pages/CreateRoom/Index';
import Room from './pages/Room/Index';
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
      path:'*',
      element: <Navigate to={'/'}/>
    }
  ])
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
