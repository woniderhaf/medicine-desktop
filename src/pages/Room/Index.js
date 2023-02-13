import React, { useRef, useState, useEffect } from 'react'
import {useParams,redirect, Navigate, useNavigate} from 'react-router-dom'
import useWebRTC, { LOCAL_VIDEO } from '../../hooks/useWebRTC'
import './index.css'


import audio from '../../assets/audio.svg'
import audioOff from '../../assets/audioOff.png'
import camera from '../../assets/camera.svg'
import cameraOff from '../../assets/cameraOff.png'
import avatar from '../../assets/userAvatar.jpg'
import fileSvg from '../../assets/file.svg'
import clipSvg from '../../assets/clip.svg'
import imageSvg from '../../assets/image.svg'
import fileSendSvg from '../../assets/send.svg'
import callOffSvg from '../../assets/Calling.svg'
import constants from '../../constants'


const Room = props => {

  const {id} = useParams()
  const navigate = useNavigate()
  const [file,setFile] = useState(null)
  const {
    clients,
    provideMediaRef, 
    changeAudio,
    changeCamera,
    rotateCamera,
    callEnd,
    roomData,
    files
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

  const {url} = constants

  useEffect(() => {
    // getRooms()
    window.onbeforeunload = function(ev) {
      ev.preventDefault()
      return false;
    };
  }, [])

  const getRooms = async () => {
    const options = {
      headers: { 'Content-Type': 'application/json', 'Authorization':'eyJhbGciOiJIUzI1NiJ9.bWVkaWNpbmU.O_X9bVp1x9ZPgmvQ_fvEhmBcOi250rXiJzbXl9hO7RM'},
    }
    const rooms = await fetch(`${url}/getRooms`, options).then(res => res.json())
    const isRoom = rooms.includes(id)
    if(!isRoom) {
      navigate('/notFound')
    }
  }

  const [isFrontCamera,setIsFrontCamera] = useState(true)
  const [isCamera,setIsCamera] = useState(true)
  const [isAudio,setIsAudio] = useState(true)
  const [isCallEnd,setIsCallEnd] = useState(false)
  const [loading,setLoading] = useState(false)
  const [sendFile,setSendFile] = useState('wait') // wait || send || error
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
  useEffect(() => {
    console.log({roomData});
  }, [roomData])
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

  const fileSend = async () => {
    setLoading(true)
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
    try {
      fetch(roomData.medmis_upload_files_url, options).then(res => setSendFile('send')).catch(res => setSendFile('error')).finally(() => {setLoading(false)})
    } catch (error) {
        setSendFile('error')
        setLoading(false)
    }
  }
  const openFile = async (v) => {
    const URL = window.URL || window.webkitURL
    const byteChars = atob(v.base64)
    let bytes = []
    for (let i = 0; i < byteChars.length; i++)
    bytes[i] = byteChars.charCodeAt(i);

    const  blob = new Blob([new Uint8Array(bytes)], {type: v.type});
    const downloadUrl = URL.createObjectURL(blob);
    const newWin = window.open(downloadUrl, '_blank')
    newWin.focus()
    URL.revokeObjectURL(downloadUrl)

  }
  const sendFilesPatient = async () => {
    setLoading(true)
    let body = []
    files.forEach(file => {
      const key = file.name
      const value = file.base64
      const v = {[key]:value}
      body.push(v)
    })
    
    const options = (data) =>  ({
      method:"POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: new URLSearchParams(data)
    })
    console.log(body);
    try {
      body.forEach(file => {
        fetch(roomData?.medmis_upload_files_url, options(file)).then(res => setSendFile('send')).catch(res => setSendFile('error')).finally(() => {setLoading(false)})
      })
    } catch (error) {
      console.log('error', error);
        setSendFile('error')
        setLoading(false)
    }
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
                playsInline
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

                <label htmlFor="file" className='fileLabel'><img src={clipSvg}/></label>
                <input id='file' type='file' className='file' onChange={changeFile}/>

                <div  onClick={callOff} >
                  <img src={callOffSvg} />
                  {/* <SvgXml xml={icons.callOff}/> */}
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
              <img  src={avatar}  className='avatar'/>
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

              <label htmlFor="file" className='fileLabel'><img src={clipSvg}/></label>
              <input id='file' type='file' className='file' onChange={changeFile} />

              <div  onClick={callOff} >
                <img src={callOffSvg} />
              </div>

            </div>
          </div>
          : null
        }
      {clients.length > 1 ? <div className='time'>
          <p>{redactorTimer(timer)}</p>
        </div> : null}

        {
          files.length ? 
          <div className='fileWrapper scroll'>
            {files.map((v,i) => 
              <div key={i} className='filesBlock'>
                <p>{v.name}</p>
                <button onClick={() => openFile(v)}>
                  посмотреть
                </button>
              </div>
            )}
            <button onClick={sendFilesPatient} disabled={loading}>
              {loading ? 'Отправка в ЭМК' : 'Отправить в ЭМК'}
            </button>
          </div>

          : null
        }

    
          {isCallEnd? <Navigate to={'/medicine-desktop'}/> : null}

      </div>
      {file ? 
        <div className='modal'>
          <div className={`modal_wrapper content_top ${sendFile === 'wait' ? 'max_content' : 'min_content'}`}>
            <div className="modal_top">
              <p>Прикрепление файла</p>
              <div className="close" onClick={() => setFile(null)}>&times;</div>
            </div>

          {
            sendFile === 'wait' ?
            <>
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

                {loading ? 
                  <div className='fileBlock click'>
                    <p>Отправление...</p>
                    <div className='partition'/>
                    <img src={fileSendSvg} className='fileSend'/>
                  </div>
                  :
                  <div onClick={fileSend}  className='fileBlock click'>
                    <p>Отправить</p>
                    <div className='partition'/>
                    <img src={fileSendSvg} className='fileSend'/>
                  </div>
                }

              </div>

            </>
            : sendFile === 'send' ?
              <div className='fileBlock'>
                  <p>Файл успешно прикреплен</p>
              </div>
            : 
              <div className='fileBlock'>
                <p>Ошибка прикрепления файла</p>
              </div>
          }

          </div>
        </div>
       : null
      }
    </>

  )
}

export default Room