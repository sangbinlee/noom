// 공통 함수 모음

export function messageEvent(event, clientId, setClientId, messageshow, playNotificationSound) {
  console.log(`■■■■■■■■■■■■■■■■ from server event.data=${event.data}`);
  const obj = JSON.parse(event.data);

  if (clientId === "") {
    console.log(`■■■■■■■■■■■■■■■■ welcome clientId=${clientId}`);
    setClientId(obj.clientId);
  }

  messageshow(obj, clientId);
  playNotificationSound();
}

export function messageshow(obj, clientId, list, clientIdSpan) {
  const li = document.createElement("li");
  li.innerHTML = `(${obj.clientId}) : ${obj.msg}`;
  list.appendChild(li);
  clientIdSpan.innerHTML = `Client ID: ${clientId}`;
}

export function playNotificationSound(audio) {
  audio.muted = false;
  audio.currentTime = 0;
  audio.play().catch((error) => {
    console.error("자동 재생이 차단되었습니다. 사용자의 상호작용이 필요합니다.", error);
  });
}

export function makeJsonMessage(type, msg, clientId) {
  return JSON.stringify({ type, msg, clientId });
}

export function handleSubmit(event, messageForm, socket, clientId) {
  event.preventDefault();
  const type = "message";
  const input = messageForm.querySelector("input");
  const message = input.value;
  socket.send(makeJsonMessage(type, message, clientId));
  input.value = "";
}

export function handleNickSubmit(event, nicknameForm, socket, clientId, clientIdSpan) {
  event.preventDefault();
  const type = "nickname";
  const input = nicknameForm.querySelector("input");
  const message = input.value;
  socket.send(makeJsonMessage(type, message, clientId));
  clientIdSpan.innerHTML = `Client ID: ${clientId} (닉네임: ${message})`;
  input.value = "";
}
