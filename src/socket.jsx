// src/socket.js
import { io } from "socket.io-client";


export const socket = io("ramdanmubarak-n5ilwmz5.b4a.run", {
    transports: ["polling", "websocket"] // ضيف السطر ده ضروري!
});










