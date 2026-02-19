// src/socket.js
import { io } from "socket.io-client";




// استبدل الرابط بالرابط الجديد بتاعك
export const socket = io("https://ramdanmubarak-hvtoma8i.b4a.run", {
  transports: ["websocket"], // إجبار المتصفح على استخدام Websocket مباشرة
  upgrade: false,
  forceNew: true
});
























