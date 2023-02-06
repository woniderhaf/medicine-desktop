import { createContext } from 'react';
import io from 'socket.io-client'

// const socketData = io('https://95.161.194.246:4444', {transports:['websocket'], });
const socketData = io('https://testms.medmis.ru', {transports:['websocket'], });


export const socket = createContext(socketData)