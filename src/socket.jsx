// src/socket.js
import { io } from "socket.io-client";


export const socket = io("ramdanmubarak-rp04ulie.b4a.run", {
    transports: ["polling", "websocket"] // ضيف السطر ده ضروري!
});



























