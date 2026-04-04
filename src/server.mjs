// console.log('hello')
import http from "http";
import WebSocket from "ws";
import express from "express";
import path from "path";
import { connect } from "http2";

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.render("home", { title: "Home Page", message: "Hello from Pug!" });
});

console.log("__dirname==============", __dirname);
console.log("process.cwd()==============", process.cwd());

const sockets = [];
const msgs = [];
let clientId = 0;

wss.on("connection", (socket) => {
  // 클라이언트 연결 감지
  connectionEvent(socket);

  // 클라이언트가 보낸 메지시 받기
  socket.on("message", (message) => {
    messageEvent(socket, message);
  });

  // 클라이언트 연결 종료 감지
  socket.on("close", (message) => {
    console.log("2 ■■■■■■■■■■■ close!");
    console.log("2 ■■■■■■■ Client browser disconnected!", message);

    console.log(`■■■■ Client ${socket.id} disconnected!`);
    
    // 1. 나간 사용자의 정보를 담은 메시지 생성
    const exitMsg = `채팅서버 : ${socket.id}번 손님이 퇴장하셨습니다.`;
    const dataStr = makeJsonMessage("exit", exitMsg); // type을 "exit"으로 지정

    // 2. 관리 중인 배열에서 나간 소켓 제거 (필수)
    const index = sockets.indexOf(socket);
    if (index > -1) {
      sockets.splice(index, 1);
    }

    // 3. 나머지 클라이언트들에게 퇴장 알림 전송
    sockets.forEach((s) => {
      s.send(dataStr);
    });



  });
});

// custom function
function makeJsonMessage(type, msg, clientId) {
  const data = { type: type, msg: msg, clientId: clientId };
  // const data = { type, msg, clientId };
  return JSON.stringify(data);
}

function parseString(jsonString) {
  return JSON.parse(jsonString);
}

function messageEvent(socket, message) {
  const msg = parseString(message);
  const type = msg.type;
  console.log("");
  console.log("2 ■■■■■■■■■■■ messageEvent!");
  console.log("2 ■■■ Received message from client: message", `${message}`);
  console.log("2 ■■■ Received message from client: msg", `${msg}`);
  console.log("2 ■■■ Received message from client: msg.msg", `${msg.msg}`);
  console.log("2 ■■■ Received message from client: type", `${type}`);
  if (type === "message") {
    msgs.push(msg.msg);
    sockets.forEach((s) => {
      console.log(`3 ■■■■■■■ Sending message to client: s=${s.id}`);
      console.log(`3 ■■■■■■■ Sending message to client: s=${message}`);
      console.log(`3 ■■■■■■■ Sending message to client: s=${msg.msg}`);
      s.send(makeJsonMessage("server", msg.msg, socket.id));
    });

    // msgs.forEach((msg) => {
    //   console.log(`2 ■■■■■■■■■■■ message=${msg}`);
    //   console.log(
    //     "3 ■■■■■■■ Sending message to client: s=",
    //     makeJsonMessage("server", msg),
    //   );
    //   // socket.send(makeJsonMessage("server", msg));
    // });
  }



  // socket.send(`■■■■■■■ Server received: ${message}`);
  // sockets.forEach((s) => {
  //   // console.log(`■■■■ send received msg to client browser . msg=${message}`)
  //   console.log(
  //     "3 ■■■■■■■ Sending message to client: s=",
  //     makeJsonMessage("welcome", s.id),
  //   );
  //   // s.send(makeJsonMessage("welcome", s.id));
  // });
}

function connectionEvent(socket) {
  console.log("1 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ conn .........  접속 connected to browser!");
  clientId++;
  socket.id = clientId;
  sockets.push(socket);
  const welcomeMsg = `채팅서버 : 채팅방에 ${clientId} 손님이 접속 하셨습니다.welcome!`;
  console.log(`1 ■■■■■■■■■■■ 유저 접속 ${welcomeMsg}`);
  const dataStr = makeJsonMessage("welcome", welcomeMsg, socket.id)

  sockets.forEach((s) => {
    console.log(`1 ■■■■■■■■■■■ 유저 접속 dataStr=${dataStr}`);
    s.send(dataStr);
  });
}




const handleListen = () =>
  console.log(`server.js .... listening on http://localhost:${PORT}`);
server.listen(PORT, handleListen);
