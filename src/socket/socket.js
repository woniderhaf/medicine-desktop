import { createContext } from 'react';
import io from 'socket.io-client'

// const socket = io('http://192.168.0.104:4444', {transports:['websocket'], });
// const socketData = io('http://192.168.0.113:4444', {transports:['websocket'], });
const socketData = io('http://localhost:4444', {transports:['websocket'], });


export const socket = createContext(socketData)
// const socket = io('http://localhost:4444', {transports:['websocket'], });
// export default socket