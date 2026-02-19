// src/socket.js
import { io } from "socket.io-client";




// استبدل الرابط بالرابط الجديد بتاعك


// استبدل الرابط برابط السيرفر الجديد بتاعك
export const socket = io("https://ramdanmubarak-hvtoma8i.b4a.run", {
    transports: ["websocket"], // أهم سطر: هيمنع الـ Polling الفاشل
    upgrade: false,           // يمنع المحاولات التانية غير الـ websocket
    reconnection: true,       // يحاول يعيد الاتصال لو فصل
    reconnectionAttempts: 10
});




















