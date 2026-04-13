// socketHandler.js
import { WebSocketServer } from "ws";
import { connectionEvent, messageEvent, closeEvent } from "./common.js";

export function initSocketServer(server) {
  const wss = new WebSocketServer({ server }); // 여기서 바로 생성
  const sockets = [];
  const msgs = [];
  let clientId = 0;

  wss.on("connection", (socket) => {
    clientId++;
    connectionEvent(socket, sockets, clientId);

    socket.on("message", (message) => {
      messageEvent(socket, message, sockets, msgs);
    });

    socket.on("close", () => {
      closeEvent(socket, sockets);
    });
  });
}
