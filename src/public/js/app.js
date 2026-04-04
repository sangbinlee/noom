const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket(`${protocol}://${window.location.host}`);

const nicknameForm = document.querySelector("#nicknameForm");
const messageForm = document.querySelector("#messageForm");
const list = document.querySelector("ul");
const clientIdSpan = document.getElementById("clientId");
const nicknameInput = document.getElementById("nickname");

let clientId = "";

socket.addEventListener("open", () => {
  console.log("WebSocket connection established!");
});

socket.addEventListener("message", (event) => {

  messageEvent(event);
});

socket.addEventListener("close", () => {
  console.log("WebSocket connection closed.");
});

// socket.addEventListener('error', (error) => {
//   console.error('WebSocket error:', error)
// })

// setTimeout(() => {
//   console.log('send from browser')
//   const type = 'welcome';
//   const message = `■■  클라이언트 ${clientId} 번 손님이 채팅방에 들어오셨어요. 환영합니다!`
//   console.log('■■■■■■■■■■ client message=' ,message)
//   // console.log(`■■■■■■■■■■ client message=${message} `)
//   // socket.send(makeJsonMessage(type, message))
// }, 100);


// custom function

function messageEvent(event) {
  console.log( `■■■■■■■■■■■■■■■■ from server event.data=${event.data}`);
  
  const obj = JSON.parse(event.data);
  const li = document.createElement("li");
  // li.innerText = obj;  
  // li.innerHTML=obj;
  if (clientId === "") { 
    console.log(`■■■■■■■■■■■■■■■■ welcome clientId=${clientId}`);
    clientId = obj.clientId;
  }
 
  li.innerHTML = `(${obj.clientId}) : ${obj.msg}`;
  console.log(`■■■■■■■■■■■■■■■■ clientId=${clientId}`);
  list.appendChild(li);
  clientIdSpan.innerHTML = `Client ID: ${clientId}`;

}


function makeJsonMessage(type, msg) {
  const data = { type: type, msg: msg, clientId: clientId };

  return JSON.stringify(data);
}

function handleSubmit(event) {
  event.preventDefault(); // 폼 제출 기본 동작 방지
  const type = "message";
  const input = messageForm.querySelector("input");
  const message = input.value; // 입력된 메시지 가져오기
  console.log("send from browser:", makeJsonMessage(type, message));
  socket.send(makeJsonMessage(type, message)); // WebSocket을 통해 메시지 전송
  input.value = ""; // 입력 필드 초기화
}

function handleNickSubmit(event) {
  event.preventDefault(); // 폼 제출 기본 동작 방지
  const type = "nickname";
  const input = nicknameForm.querySelector("input");
  const message = input.value; // 입력된 메시지 가져오기
  console.log("send from browser:", makeJsonMessage(type, message));
  socket.send(makeJsonMessage(type, message)); // WebSocket을 통해 메시지 전송
  input.value = ""; // 입력 필드 초기화
}

// 커스텀 이벤트 리스너 등록
// 메시지 폼 제출 이벤트 리스너 등록
messageForm.addEventListener("submit", handleSubmit);
// 닉네임 폼 제출 이벤트 리스너 등록
nicknameForm.addEventListener("submit", handleNickSubmit);

// 윈도우 이벤트 리스너 등록
// 브라우저 새로고침 또는 페이지 종료 시 이벤트
window.addEventListener("beforeunload", () => {
  console.log("브라우저가 새로고침 또는 종료됩니다.");

  alert("채팅방에서 나가시겠습니까?"); // 사용자에게 확인 메시지 표시
});

window.addEventListener("beforeunload", () => {
  // 서버에 '사용자 나감' 알림 전송
  // const data = JSON.stringify({ userId: "user123", status: "refresh" });
  // navigator.sendBeacon("/api/user-exit", data);

  const type = "refresh";
  const message = "새로고침"; // 입력된 메시지 가져오기
  console.log("send from browser:", makeJsonMessage(type, message));
  socket.send(makeJsonMessage(type, message)); // WebSocket을 통해 메시지 전송
  // socket.close(); // WebSocket 연결 닫기
});

// window.addEventListener('beforeunload', (event) => {
//   const result = confirm('채팅방에서 나가시겠습니까?'); // 사용자에게 확인 메시지 표시
//   console.log('■■■■■■■■■■■■■■■■■■result==', result)
//   if (!result) {
//     event.preventDefault(); // 일부 브라우저에서 필요
//     event.returnValue = ''; // 크롬은 커스텀 메시지 무시, 기본 안내창만 표시
//   }
//   console.log('브라우저가 새로고침 또는 종료됩니다.');
//   alert('채팅방에서 나가시겠습니까?'); // 사용자에게 확인 메시지 표시

// });
