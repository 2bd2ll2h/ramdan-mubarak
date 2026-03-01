import { io } from "socket.io-client";

const URL = "https://ramdanmubarak-ke9k03s9.b4a.run"; 

export const socket = io(URL, {
  // بنخلي الـ websocket الأول عشان السرعة في الألعاب التفاعلية
  transports: ["websocket", "polling"], 
  
  // بنخلي الـ upgrade مسموح به عشان لو الـ websocket واجه مشكلة ينزل للـ polling تلقائياً
  upgrade: true, 
  








  

  
  
});











