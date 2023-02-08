import { createContext } from 'react';
import io from 'socket.io-client'

// const socketData = io('https://testms.medmis.ru', {transports:['websocket'], });
const socketData = io('http://localhost:4444', {transports:['websocket'], });


export const socket = createContext(socketData)