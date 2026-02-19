// src/socket.js
import { io } from "socket.io-client";




// استبدل الرابط بالرابط الجديد بتاعك


// استبدل الرابط برابط السيرفر الجديد بتاعك


export const socket = io("https://ramdanmubarak-1j04io0x.b4a.run", {
  transports: ["websocket"], // لازم تكون دي لوحدها في المصفوفة
  upgrade: false // ده بيمنع السوكيت إنه يحاول يرجع للـ polling لو الـ websocket فشل
});



















