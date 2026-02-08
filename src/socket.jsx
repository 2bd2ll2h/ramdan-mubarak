import { io } from "socket.io-client";

// الرابط اللي كان مطلع Cannot GET / هو اللي هيتحط هنا
const socket = io("https://asset-manager--fatimaandashra.replit.app", {
    transports: ["websocket"]
});

export { socket };