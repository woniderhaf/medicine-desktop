import './App.css';
// import socket from './socket/socket';
import {Routes,Route, Navigate} from 'react-router-dom'
import CreateRoom from './pages/CreateRoom/Index';
import Room from './pages/Room/Index';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<CreateRoom/>}/>
        <Route path='/:id' element={<Room/>}/>
        <Route path='*' element={<div>
          <p>error page</p>
          <Navigate to={'/'}><p>go home</p></Navigate>
        </div>}/>
      </Routes>
    </div>
  );
}

export default App;
