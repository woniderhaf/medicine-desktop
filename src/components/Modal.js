import React, {useEffect,useState} from "react"
import {Link} from 'react-router-dom'
import { v4 } from "uuid"
import '../App.css'

const Modal = ({setIsModal,patient_name,setFio, date,setDate,time,setTime}) => {
  const [isCreating,setIsCreating] = useState(false)
  const [data,setData] = useState(null)
  const body = {
    patient_name,
    date,
    time,
    // medmis_upload_files_url: 'https://node10.medmis.ru/wcrs/telemed_upload_files/5EF2E8C6-0D48-4633-A534-43339D38B7E2/D4PGXONWO0CEFGFXCGMRIWYF4P8GCJPK2ZHGZGJSUETW'
  }
  const createRoom = () => {
    setIsCreating(true)
    // fetch('http://localhost:4444/createRoom', 
    fetch('https://testms.medmis.ru/createRoom', 
    { 
      method:'POST',
      body:JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', 'Authorization':'eyJhbGciOiJIUzI1NiJ9.bWVkaWNpbmU.O_X9bVp1x9ZPgmvQ_fvEhmBcOi250rXiJzbXl9hO7RM'},
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
            <label htmlFor="FIO">ФИО пациента</label>
            <input type="text" id="FIO"  value={patient_name} onChange={text => setFio(text.nativeEvent.target.value)}/>
            <label htmlFor="date">Дата</label>
            <input type="date" id="date"   value={date} onChange={text => setDate(text.nativeEvent.target.value)}/>
            <label htmlFor="time">Время</label>
            <input type={'time'} id="time" value={time} onChange={text => setTime(text.nativeEvent.target.value)}/>
          </>
        }
        <div className="modal_main">
          {
            data 
            ?
              // <a className="btn" href={data.url}  target={'_blank'}>
              <Link to={`room/${data.roomId}`}>
                <button onClick={() => setIsModal(false)}>
                  <p className="text">перейти в комнату</p>
                </button> 
              </Link>

              // </a>    
            : null
          }
        </div>

        <div className="modal_bottom">
          <button className="back" onClick={() => {setIsModal(false); setDate(''); setFio(''); setTime('')}}>Отменить</button>
          { isCreating 
            ? <button disabled className="create">Создание...</button>
            : !data ? <button disabled={!(patient_name && time && date)} onClick={createRoom} className="create">Создать</button> : null
          }
        </div>
      </div>
    </div>
  )

}


export default Modal