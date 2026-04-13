// common.js

// JSON 메시지 생성
export function makeJsonMessage(type, msg, clientId) {
  return JSON.stringify({ type, msg, clientId });
}

// 문자열을 JSON으로 파싱
export function parseString(jsonString) {
  return JSON.parse(jsonString);
}

// 클라이언트 연결 종료 이벤트
export function closeEvent(socket, sockets) {
  console.log("■■■■ Client disconnected!", socket.id);

  // 배열에서 제거
  const index = sockets.indexOf(socket);
  if (index > -1) sockets.splice(index, 1);

  // 나머지 클라이언트에게 알림
  const exitMsg = `채팅서버 : ${socket.id}번 손님이 퇴장하셨습니다.`;
  sockets.forEach((s) => {
    const dataStr = makeJsonMessage("exit", exitMsg, "[server]");
    s.send(dataStr);
  });
}

// 메시지 이벤트 처리
export function messageEvent(socket, message, sockets, msgs) {
  const msg = parseString(message);
  const { type } = msg;

  switch (type) {
    case "nickname":
      socket.nickname = msg.msg;
      break;
    case "message":
      msgs.push(msg.msg);
      sockets.forEach((s) => {
        s.send(makeJsonMessage("server", `${socket.nickname}: ${msg.msg}`, socket.id));
      });
      break;
    default:
      console.log(`Unknown type=${type}`);
  }
}

// 연결 이벤트 처리
export function connectionEvent(socket, sockets, clientId) {
  socket.id = clientId;
  sockets.push(socket);
  socket.nickname = `손님${clientId}`;

  const welcomeMsg = `채팅서버 : 채팅방에 ${socket.nickname} 이 접속 하셨습니다.`;
  const dataStr = makeJsonMessage("welcome", welcomeMsg, socket.id);

  sockets.forEach((s) => s.send(dataStr));
}
