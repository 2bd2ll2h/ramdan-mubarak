import { io } from "socket.io-client";

const URL = "https://ramdanmubarak-f7ykzrzw.b4a.run";

export const socket = io(URL, {
  transports: ["polling", "websocket"],
  upgrade: false,
  reconnectionAttempts: 10
});





















