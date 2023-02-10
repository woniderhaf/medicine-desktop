import {useEffect, useRef, useCallback, useState,useContext} from 'react';
import freeice from 'freeice';
import { useNavigate } from 'react-router-dom';
import useStateWithCallback from './useStateWithCallback';
import ACTIONS from '../socket/actions';
import { socket as io } from '../socket/socket';
export const LOCAL_VIDEO = 'LOCAL_VIDEO';


export default function useWebRTC(roomID) {
  const navigate = useNavigate();
  const socket = useContext(io)
  const [clients, updateClients] = useStateWithCallback([]);
  const [roomData,setRoomData] = useState(null)
  const callEnd = async (room) => {
    socket.emit(ACTIONS.LEAVE, {room})
  }

  const rotateCamera = async() => {
    const videoTrack = await localMediaStream.current.getVideoTracks()[ 0 ];
    videoTrack._switchCamera();
  }

  const changeAudio = async(bool) => {
    const audioTrack = await localMediaStream.current.getAudioTracks()[ 0 ];

    if(bool) {
      audioTrack.enabled = true
    }
    else {
      audioTrack.enabled = false
    }
  }

  const changeCamera = async(videoBool) => {
    const videoTrack = await localMediaStream.current.getVideoTracks()[ 0 ];
    videoTrack.enabled = videoBool
  }

  const addNewClient = useCallback((newClient, cb) => {
    updateClients(list => {
      if (!list.includes(newClient)) {
        return [...list, newClient]
      }

      return list;
    }, cb);
  }, [clients, updateClients]);

  const peerConnections = useRef({});
  const localMediaStream = useRef(null);
  const peerMediaElements = useRef({
    [LOCAL_VIDEO]: null,
  });
  useEffect(() => {
    socket.on(ACTIONS.CALL_END, () => {
      console.log('CALL_END');
    })
    async function handleNewPeer({peerID, createOffer}) {
      if (peerID in peerConnections.current) {
        return console.warn(`Already connected to peer ${peerID}`);
      }

      peerConnections.current[peerID] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      peerConnections.current[peerID].onicecandidate = event => {
        if (event.candidate) {
          socket.emit(ACTIONS.RELAY_ICE, {
            peerID,
            iceCandidate: event.candidate,
          });
        }
      }

      let tracksNumber = 0;
      peerConnections.current[peerID].ontrack = ({streams: [remoteStream]}) => {
        tracksNumber++

        if (tracksNumber > 0) { // video & audio tracks received
          tracksNumber = 0;
          addNewClient(peerID, () => {
            if (peerMediaElements.current[peerID]) {
              peerMediaElements.current[peerID].srcObject = remoteStream;
            } else {
              // FIX LONG RENDER IN CASE OF MANY CLIENTS
              let settled = false;
              const interval = setInterval(() => {
                if (peerMediaElements.current[peerID]) {
                  peerMediaElements.current[peerID].srcObject = remoteStream;
                  settled = true;
                }

                if (settled) {
                  clearInterval(interval);
                }
              }, 1000);
            }
          });
        }
      }

      localMediaStream.current?.getTracks().forEach(track => {
        peerConnections.current[peerID].addTrack(track, localMediaStream.current);
      });

      if (createOffer) {
        const offer = await peerConnections.current[peerID].createOffer();

        await peerConnections.current[peerID].setLocalDescription(offer);

        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: offer,
        });
      }
    }

    socket.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.off(ACTIONS.ADD_PEER);
      socket.off(ACTIONS.CALL_END);

    }
  }, []);

  useEffect(() => {
    async function setRemoteMedia({peerID, sessionDescription: remoteDescription}) {
      await peerConnections.current[peerID]?.setRemoteDescription(
        new RTCSessionDescription(remoteDescription)
      );

      if (remoteDescription.type === 'offer') {
        const answer = await peerConnections.current[peerID].createAnswer();

        await peerConnections.current[peerID].setLocalDescription(answer);

        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: answer,
        });
      }
    }

    socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia)

    return () => {
      socket.off(ACTIONS.SESSION_DESCRIPTION);
    }
  }, []);

  useEffect(() => {
    socket.on(ACTIONS.ICE_CANDIDATE, ({peerID, iceCandidate}) => {
      peerConnections.current[peerID]?.addIceCandidate(
        new RTCIceCandidate(iceCandidate)
      );
    })
    socket.on(ACTIONS.ROOM_DATA, res => {setRoomData(res); console.log('room data',res);})

    return () => {
      socket.off(ACTIONS.ICE_CANDIDATE);
      socket.off(ACTIONS.ROOM_DATA)
    }
  }, []);

  useEffect(() => {
    const handleRemovePeer = ({peerID}) => {
      if (peerConnections.current[peerID]) {
        peerConnections.current[peerID].close();
      }

      delete peerConnections.current[peerID];
      delete peerMediaElements.current[peerID];

      updateClients(list => list.filter(c => c !== peerID));
    };

    socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    return () => {
      socket.off(ACTIONS.REMOVE_PEER);
    }
  }, []);

  useEffect(() => {
    async function startCapture() {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameraDevices = devices.filter(device => device.kind === 'videoinput' ? device:false)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width:1280,
          height:720
        }
      }).catch(err => {console.log(err);});
      // if(!mediaStream) {
      //   alert('Подключите камеру и повторите попытку')
      //   navigate('/')
      // }
      if(cameraDevices.length < 1 && mediaStream) {
        let videoTrack = await mediaStream.getVideoTracks()[ 0 ];
        videoTrack.enabled = false;
      }
      console.log({mediaStream});
      localMediaStream.current = mediaStream

      addNewClient(LOCAL_VIDEO, () => {
        const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];

        if (localVideoElement) {
          localVideoElement.volume = 0;
          localVideoElement.srcObject = localMediaStream.current;
        }
      });
    }

    startCapture()
      .then(() => socket.emit(ACTIONS.JOIN, {room: roomID}))
      .catch(e => console.error('Error getting userMedia:', e));

    return () => {
      localMediaStream.current?.getTracks().forEach(track => track.stop());

      socket.emit(ACTIONS.LEAVE, {room:roomID});
    };
  }, [roomID]);

  const provideMediaRef = useCallback((id, node) => {
    peerMediaElements.current[id] = node;
  }, []);


  return {
    clients,
    localMediaStream,
    peerConnections,
    rotateCamera,
    changeAudio,
    changeCamera,
    roomData,
    provideMediaRef,
    callEnd
  };
}