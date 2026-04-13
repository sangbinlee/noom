import { registerSocketEvents } from "./events.js";
import { createAudio } from "./audio.js";

const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket(`${protocol}://${window.location.host}`);

const nicknameForm = document.querySelector("#nicknameForm");
const messageForm = document.querySelector("#messageForm");
const list = document.querySelector("ul");
const clientIdSpan = document.getElementById("clientId");

let clientId = "";
const setClientId = (id) => { clientId = id; };

const audio = createAudio();

// 이벤트 리스너 등록
registerSocketEvents(socket, clientId, setClientId, list, clientIdSpan, messageForm, nicknameForm, audio);
