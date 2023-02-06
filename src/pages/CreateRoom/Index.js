import React, {useContext, useEffect, useState} from "react"
import { socket } from "../../socket/socket"
import {Link} from 'react-router-dom'
import ACTIONS from '../../socket/actions'
import {v4} from 'uuid'
import Modal from "../../components/Modal"
import './index.css'
const CreateRoom = props => {

  const [rooms,setRooms] = useState([])
  const [isModal,setIsModal] = useState(false)
  const [fio,setFio] = useState('')
  const io = useContext(socket)


  useEffect(() => {
    io.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
      setRooms(rooms)
    })
  },[])



  return (
    <div className="wrapper">
      <div>
        <p>комнаты</p>
        <div>{rooms.map(v=> {
          return (
            <a key={v} className="room" href={`medicine-desktop/room/${v}`} target='_blank'>
              <p>{v}</p>
            </a>   
          )
        })}</div>
      </div>
      <button onClick={() => {setIsModal(true)}}>
        <p className="text">Создать комнату</p>       
      </button>
      {isModal 
        ? <Modal setIsModal={setIsModal} fio={fio} setFio={setFio}/>
        : null
      }
    </div>
  )
}

export default CreateRoom