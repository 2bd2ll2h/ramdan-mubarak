import { io } from "socket.io-client";

// الرابط اللي كان مطلع Cannot GET / هو اللي هيتحط هنا
const socket = io("https://server-assets--bdallahashrf110.replit.app", {
    transports: ["websocket"]
});

export { socket };