// src/socket.js
import { io } from "socket.io-client";


export const socket = io("https://ramdanmubarak-2xuze6kw.b4a.run", {
    transports: ["polling", "websocket"] // ضيف السطر ده ضروري!
});










