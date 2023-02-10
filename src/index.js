import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter,Link,Navigate,RouterProvider} from 'react-router-dom'
import CreateRoom from './pages/CreateRoom/Index';
import Room from './pages/Room/Index';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <App/>
);

