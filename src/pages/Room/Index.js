import React, { useRef, useState, useEffect } from 'react'
import {useParams,redirect, Navigate} from 'react-router-dom'
import useWebRTC, { LOCAL_VIDEO } from '../../hooks/useWebRTC'
import './index.css'

import audio from '../../assets/audio.png'
import audioOff from '../../assets/audioOff.png'
import camera from '../../assets/camera.png'
import cameraOff from '../../assets/cameraOff.png'
import cameraRotateIco from '../../assets/cameraRotate.png'
import callOffIco from '../../assets/callOff.png'
import { socket } from '../../socket/socket'
import ACTIONS from '../../socket/actions'

const Room = props => {
  const {id} = useParams()
  const {
    clients,
    provideMediaRef, 
    changeAudio,
    changeCamera,
    rotateCamera,
    callEnd
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

  return (
    <div className=''>
      {clients.map((clientId,index) => {
        return (
          <div key={clientId}>
            <video
              ref={instance => {provideMediaRef(clientId,instance)}}
              muted={clientId===LOCAL_VIDEO}
              id='videoElement'
              className={clientId === LOCAL_VIDEO ? 'videoLocal' :'videoRemote'}
              autoPlay
              
            />
          </div>
        )
      })}
     {clients.length > 1 ? <div className='time'>
        <p>{redactorTimer(timer)}</p>
      </div> : null}

      <div className='settings'>

        {/* <div  onClick={cameraRotate} style={{height:50,width:50}}>
          <img src={cameraRotateIco}/>
        </div> */}

        <div
          onClick={changeCameraFunc} 
          // style={{height:50,width:50, flexDirection:'row', alignItems:'center', justifyContent:'center'}}
        >
          <img src={isCamera? camera : cameraOff}/>
        </div>

        <div  onClick={changeAudioFunc} style={{height:50,width:50}}>
          <img src={isAudio ? audio : audioOff}/>
        </div>

        <div  onClick={callOff} className='callOff'>
          <img src={callOffIco} />
        </div>

      </div>
        {isCallEnd? <Navigate to={'/'}/> : null}
    </div>
  )
}

export default Room