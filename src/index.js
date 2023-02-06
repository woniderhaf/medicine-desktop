import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter,Link,Navigate,RouterProvider} from 'react-router-dom'
import CreateRoom from './pages/CreateRoom/Index';
import Room from './pages/Room/Index';


const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path:'/medicine-desktop',
    element: <CreateRoom/>
  },
  {
    path:'/medicine-desktop/room/:id',
    element: <Room/>
  },
  {
    path:'*',
    element: <div>
      <p>error page</p>
      <Link to={'/medicine-desktop'}>
      <p>home page</p>
      </Link>
    </div>
  }
])
root.render(
  // <React.StrictMode>
    <RouterProvider router={router}/>
  // </React.StrictMode>
);

