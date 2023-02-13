import { createContext } from 'react';
import io from 'socket.io-client'
import constants from '../constants';

// const socketData = io('https://testms.medmis.ru', {transports:['websocket'], });
const socketData = io(constants.url, {transports:['websocket'], });


export const socket = createContext(socketData)