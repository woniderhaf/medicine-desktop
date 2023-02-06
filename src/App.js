import './App.css';
// import socket from './socket/socket';
import {Routes,Route, Navigate} from 'react-router-dom'
import CreateRoom from './pages/CreateRoom/Index';
import Room from './pages/Room/Index';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/medicine-desktop/' element={<CreateRoom/>}/>
        <Route path='/medicine-desktop/:id' element={<Room/>}/>
        <Route path='*' element={<div><p>go home</p></div>}/>
      </Routes>
    </div>
  );
}

export default App;
