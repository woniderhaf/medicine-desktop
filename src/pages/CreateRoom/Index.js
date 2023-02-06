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
  const [patient_name,setFio] = useState('')
  const [date,setDate] = useState('')
  const [time,setTime] = useState('')
  const io = useContext(socket)


  useEffect(() => {
    io.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
      setRooms(rooms)
    })
  },[])



  return (
    <div className="wrapper">
      <button onClick={() => {setIsModal(true)}}>
        <p className="text">Создать комнату</p>       
      </button>
      {isModal 
        ? <Modal setIsModal={setIsModal} patient_name={patient_name} setFio={setFio} date={date} setDate={setDate} time={time} setTime={setTime}/>
        : null
      }
    </div>
  )
}

export default CreateRoom