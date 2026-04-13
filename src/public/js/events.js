import {
  messageEvent,
  messageshow,
  playNotificationSound,
  makeJsonMessage,
  handleSubmit,
  handleNickSubmit
} from "./common.js";
import { createAudio, enableAudioOnClick } from "./audio.js";





// const websocket = document.getElementById("websocket");
// websocket.hidden = true; // 초기에는 채팅방 숨김




export function registerSocketEvents() {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const webSocket = new WebSocket(`${protocol}://${window.location.host}`);

  const nicknameForm = document.querySelector("#nicknameForm");
  const messageForm = document.querySelector("#messageForm");
  const list = document.querySelector("ul");
  const clientIdSpan = document.getElementById("clientId");

  let clientId = "";
  const setClientId = (id) => { clientId = id; };

  const audio = createAudio();

  webSocket.addEventListener("open", () => {
    console.log("WebSocket connection established!");
  });

  webSocket.addEventListener("message", (event) => {
    messageEvent(
      event,
      clientId,
      setClientId,
      (obj) => messageshow(obj, clientId, list, clientIdSpan),
      () => playNotificationSound(audio)
    );
  });

  webSocket.addEventListener("close", () => {
    console.log("WebSocket connection closed.");
  });

  messageForm.addEventListener("submit", (event) => handleSubmit(event, messageForm, webSocket, clientId));
  nicknameForm.addEventListener("submit", (event) => handleNickSubmit(event, nicknameForm, webSocket, clientId, clientIdSpan));

  enableAudioOnClick(audio);

  window.addEventListener("beforeunload", () => {
    console.log("브라우저가 새로고침 또는 종료됩니다.");
    if (webSocket.readyState === WebSocket.OPEN) {
      const type = "refresh";
      const message = "새로고침";
      webSocket.send(makeJsonMessage(type, message, clientId));
    }
  });
}
