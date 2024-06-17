import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const DEVELOPMENT = false;
const URL = !DEVELOPMENT
  ? "https://chat-backend-6955.onrender.com"
  : "http://localhost:3500";

export const socket = io(URL, {
  autoConnect: false,
});
