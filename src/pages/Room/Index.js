import React, { useRef, useState, useEffect } from 'react'
import {useParams,redirect, Navigate} from 'react-router-dom'
import useWebRTC, { LOCAL_VIDEO } from '../../hooks/useWebRTC'
import FileBase64 from 'react-file-base64'
import './index.css'

import audio from '../../assets/audio.svg'
import audioOff from '../../assets/audioOff.png'
import camera from '../../assets/camera.svg'
import cameraOff from '../../assets/cameraOff.png'
import avatar from '../../assets/Avatar.png'
import fileSvg from '../../assets/file.svg'
import imageSvg from '../../assets/image.svg'
import fileSendSvg from '../../assets/send.svg'
import callOffSvg from '../../assets/Calling.svg'
import { socket } from '../../socket/socket'
import ACTIONS from '../../socket/actions'
const icons = {
  callOff: `<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="36" cy="36" r="36" fill="#EF4444"/><path fill-rule="evenodd" clip-rule="evenodd" d="M35.9957 35.0023C27.5347 35.0035 31.4684 40.8568 26.0824 40.8587C20.8888 40.8594 18.8759 41.832 18.8768 35.2517C18.9577 34.5083 17.5914 27.9044 35.9955 27.9018C54.4019 27.8992 53.0406 34.5036 53.1213 35.247C53.1215 41.8443 51.1089 40.8541 45.9153 40.8548C40.5282 40.8556 44.4566 35.0011 35.9957 35.0023Z" fill="white"/></svg>`,
  camera: `<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="72" height="72" rx="36" fill="#4EA356"/><path fill-rule="evenodd" clip-rule="evenodd" d="M35.9999 41.6673V41.6673C32.8705 41.6673 30.3333 39.1301 30.3333 36.0007V27.5007C30.3333 24.3712 32.8705 21.834 35.9999 21.834V21.834C39.1293 21.834 41.6666 24.3712 41.6666 27.5007V36.0007C41.6666 39.1301 39.1293 41.6673 35.9999 41.6673Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M45.9166 34.584V35.859C45.9166 41.4137 41.4768 45.9173 35.9999 45.9173V45.9173C30.5231 45.9173 26.0833 41.4137 26.0833 35.859V34.584" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M35.2917 27.4993H36.7084" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M34.5833 31.7494H37.4166" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M35.2917 36.0423H36.7084" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M36.0001 45.916V50.166" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M31.75 50.1673H40.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  micro: `<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="72" height="72" rx="36" fill="#4EA356"/><path fill-rule="evenodd" clip-rule="evenodd" d="M37.5937 44.1452H26.4375C24.6766 44.1452 23.25 42.7186 23.25 40.9577V31.041C23.25 29.2801 24.6766 27.8535 26.4375 27.8535H37.5937C39.3547 27.8535 40.7812 29.2801 40.7812 31.041V40.9577C40.7812 42.7186 39.3547 44.1452 37.5937 44.1452Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M40.7812 37.554L46.1575 41.8805C47.2002 42.7206 48.75 41.9783 48.75 40.6395V31.3604C48.75 30.0216 47.2002 29.2793 46.1575 30.1194L40.7812 34.4459" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  file: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.8789 20.9484L19.5358 15.2916C20.3179 14.5095 20.3207 13.2424 19.5415 12.4575V12.4575C18.7587 11.6677 17.4817 11.6648 16.6953 12.4511L11.7456 17.4009" stroke="#60B768" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.293 9.6348L8.89369 16.0341" stroke="#60B768" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.3643 16.7071L17.4145 21.6568" stroke="#60B768" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.8789 20.9497L13.5254 21.3033C12.1586 22.6701 9.94248 22.6701 8.57565 21.3033V21.3033C7.20881 19.9365 7.20881 17.7204 8.57565 16.3536L8.9292 16" stroke="#60B768" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.3641 16.7062V16.7062C24.3165 14.7539 24.3165 11.5875 22.3641 9.63514V9.63514C20.4118 7.68282 17.2454 7.68282 15.2931 9.63514V9.63514" stroke="#60B768" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
}

const Room = props => {
  const {id} = useParams()
  const [file,setFile] = useState(null)
  const {
    clients,
    provideMediaRef, 
    changeAudio,
    changeCamera,
    rotateCamera,
    callEnd,
    roomData
  } = useWebRTC(id)
  const [timer,setTimer] = useState(0)
  let timerRef = useRef(null)
  useEffect(() => {
    if(clients.length > 1) {
      setTimer(0)
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
  }, [clients])

  useEffect(() => {
    
    window.onbeforeunload = function(ev) {
      ev.preventDefault()
      return false;
    };
  }, [])

  const [isFrontCamera,setIsFrontCamera] = useState(true)
  const [isCamera,setIsCamera] = useState(true)
  const [isAudio,setIsAudio] = useState(true)
  const [isCallEnd,setIsCallEnd] = useState(false)
  const cameraRotate = () => {
    setIsFrontCamera(prevState => !prevState)
    rotateCamera()
  }
  const changeAudioFunc = () => {
    setIsAudio(prevState => !prevState)
    changeAudio()
  }
  const changeCameraFunc = () => {
    changeCamera(!isCamera)
    setIsCamera(prev => !prev)
  }

  const callOff = () => {
    callEnd(id)
    setTimeout(() => setIsCallEnd(true), 500)
  }

  const redactorTimer = time => {
    let seconds = time < 59 ? time : time - 60*Math.floor(time/60)
    let minutes = (time / 60) >= 1 ? Math.floor(time/60) : 0
    const times = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` :seconds}`
    return times
  }
  const  toBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = error => reject('err',error);
    });
  }
  const changeFile = async e => {
    const file = e.target.files[0]
    const base64 = await toBase64(file)
    const name = file.name
    setFile({base64,name})
  }
  const getFilesUrl = async () => {
    const url = roomData.medmis_upload_files_url
  }
  const fileSend = async () => {
    const key = file.name
    const value = file.base64
    const body  = {[key]:value}
    const options = {
      method:"POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: new URLSearchParams(body)
    }
    fetch(roomData.medmis_upload_files_url, options).then(res => res.json()).then(res => console.log(res))
  }
  return (
    <>
      <div>
        {clients.map((clientId,index) => {
          return (
            <div key={clientId}>
              <video
                ref={instance => {provideMediaRef(clientId,instance)}}
                muted={clientId===LOCAL_VIDEO}
                id={clientId === LOCAL_VIDEO ? 'videoElement' : null}
                className={clientId === LOCAL_VIDEO ? 'videoLocal' :'videoRemote'}
                autoPlay
              />
            {clientId !== LOCAL_VIDEO ? <div className='settings'>
                <div
                  onClick={changeCameraFunc} 
                  // style={{height:50,width:50, flexDirection:'row', alignItems:'center', justifyContent:'center'}}
                >
                  <img src={isCamera? camera : cameraOff}/>
                </div>
                <div  onClick={changeAudioFunc} >
                  <img src={isAudio ? audio : audioOff}/>
                </div>

                <label htmlFor="file" className='fileLabel'><img src={fileSvg}/></label>
                <input id='file' type='file' className='file' onChange={changeFile}/>

                <div  onClick={callOff} >
                  <img src={callOffSvg} />
                </div>

              </div> :null} 
            </div>
          )
        })}
        {clients.length < 2 ? 
          <div className='videoBlock'>
            <p className='patient_name'>{roomData?.patient_name}</p>
            <p className='connection'>Соединение...</p>
            <div className='patient_avatar'>
              <img  src={avatar} />
            </div>
            <div className='settings'>
              <div
                onClick={changeCameraFunc} 
                // style={{height:50,width:50, flexDirection:'row', alignItems:'center', justifyContent:'center'}}
              >
                <img src={isCamera? camera : cameraOff}/>
              </div>

              <div  onClick={changeAudioFunc} >
                <img src={isAudio ? audio : audioOff}/>
              </div>

              <label htmlFor="file" className='fileLabel'><img src={fileSvg}/></label>
              <input id='file' type='file' className='file' onChange={changeFile} />

              <div  onClick={callOff} >
                <img src={callOffSvg} />
              </div>

            </div>
          </div>
          : null
        }
      {/* {clients.length > 1 ? <div className='time'>
          <p>{redactorTimer(timer)}</p>
        </div> : null} */}

    
          {isCallEnd? <Navigate to={'/medicine-desktop'}/> : null}

      </div>
      {file ? 
        <div className='modal'>
          <div className="modal_wrapper content_top max_content">
            <div className="modal_top">
              <p>Прикрепление файла</p>
              <div className="close" onClick={() => setFile(null)}>&times;</div>
            </div>
            <div className='fileBlock'>
              <img src={imageSvg} className='svgPadding'/>
              <div className='partition'/>
              <p>{file.name}</p>
            </div>

            <div className='spaseBetween mt20'>

              <label htmlFor='changeFile' className='fileBlock click '>
                <img src={fileSvg} className='svgPadding'/>
                <div className='partition'/>
                <p>Изменить</p>
              </label>
              <input id='changeFile' type={'file'} onChange={changeFile} className='file'/>

              <div onClick={fileSend} className='fileBlock click'>
                <p>Отправить</p>
                <div className='partition'/>
                <img src={fileSendSvg} className='fileSend'/>
              </div>

            </div>
          </div>
        </div>
       : null
      }
    </>

  )
}

export default Room