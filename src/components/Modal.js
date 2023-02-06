import React, {useEffect,useState} from "react"
import {Link} from 'react-router-dom'
import { v4 } from "uuid"
import '../App.css'

const Modal = ({setIsModal,fio,setFio}) => {
  const [isCreating,setIsCreating] = useState(false)
  const [data,setData] = useState(null)
  const body = {
    fio
  }
  const createRoom = () => {
    setIsCreating(true)
    fetch('http://95.161.194.246:4444/createRoom', 
    { 
      method:'POST',
      body:JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', 'Authorization':'bearer eyJhbGciOiJIUzI1NiJ9.bWVkaWNpbmU.O_X9bVp1x9ZPgmvQ_fvEhmBcOi250rXiJzbXl9hO7RM'},
    }
    ).then(res => res.json()).then(res => {setData(res); setIsCreating(false)})
  }
  return (
    <div className="modal">
      <div className="modal_wrapper">
        <div className="modal_top">
          <p className="title">Создание комнаты</p>
          <div className="close" onClick={() => setIsModal(false)}>&times;</div>
        </div>
        {data ? null : 
          <>
            <label htmlFor="FIO">FIO</label>
            <input type="text" id="FIO"  value={fio} onChange={text => setFio(text.nativeEvent.target.value)}/>
          </>
        }
        <div className="modal_main">
          {
            data 
            ?
              // <a className="btn" href={data.url}  target={'_blank'}>
              <Link to={`/room/${data.roomId}`}>
                <button onClick={() => setIsModal(false)}>
                  <p className="text">перейти в комнату</p>
                </button> 
              </Link>

              // </a>    
            : null
          }
        </div>

        <div className="modal_bottom">
          <button className="back" onClick={() => setIsModal(false)}>Отменить</button>
          { isCreating 
            ? <button disabled className="create">Создание...</button>
            : <button onClick={createRoom} className="create">Создать</button>
          }
        </div>
      </div>
    </div>
  )

}


export default Modal