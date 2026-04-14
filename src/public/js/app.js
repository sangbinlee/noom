// import { registerSocketEvents } from "./events.js";
import "./domFocus.js";
// 파라미터 없이 호출
// registerSocketEvents();


const socket = io(); // 기본 경로에서 Socket.IO 클라이언트 초기화

const myFace = document.getElementById("myFace");
const muteButton = document.getElementById("mute");
const cameraButton = document.getElementById("camera");
const cameraSelect = document.getElementById("cameraSelect");
const call = document.getElementById("call");


const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
let myStream; // 전역 변수로 myStream 선언
let muted = false; // 음소거 상태를 추적하는 변수
let cameraOff = false; // 카메라 상태를 추적하는 변수 

let roomName = ""; // 현재 방 이름을 저장하는 변수

let myPeerConnection; // RTCPeerConnection 객체를 저장하는 변수



async function initCall() {
  console.log(`■■■■■■■■■■■ initCall.......................`)
  console.log(`■■■■■■■■■■■ initCall...welcome.hidden=true....................`)
  console.log(`■■■■■■■■■■■ initCall...call.hidden=false....................`)
  welcome.hidden = true; // welcome 요소 숨김
  call.hidden = false;
  console.log(`■■■■■■■■■■■ initCall...await getMedia()....................`)
  await getMedia(); // 미디어 스트림 확보 및 카메라 목록 가져오기
  console.log(`■■■■■■■■■■■ initCall... // await getMedia()....................`)
  console.log(`■■■■■■■■■■■ initCall...await makeConnection()....................`)
  await makeConnection(); // RTCPeerConnection 생성 및 이벤트 등록
  console.log(`■■■■■■■■■■■ initCall... // await makeConnection()....................`)
  console.log(` // ■■■■■■■■■■■ initCall.......................`)

}

  



// async function startMedia() {
//   console.log(`startMedia.......................`)
//   console.log(`startMedia.......................`)
//   console.log(`startMedia.......................`)
//   console.log(`startMedia.......................`)
//   console.log(`startMedia.......................`)
//   console.log(`startMedia.......................`)
//   console.log(`startMedia.......................`)
  
//   welcome.hidden = true; // welcome 요소 숨김
//   call.hidden = false; // call 요소 표시
//   await getMedia(); // 미디어 스트림 확보 및 카메라 목록 가져오기
//   makeConnection(); // RTCPeerConnection 생성 및 이벤트 등록
 
// }

async function makeConnection() {
  console.log(`■■■■■■■■■■■ makeConnection.................`)

  myPeerConnection = new RTCPeerConnection(); // RTCPeer    Connection 객체 생성
  myPeerConnection.addEventListener("icecandidate", handleIce); // ICE 후보 이벤트 핸들러 등록
  // myPeerConnection.addEventListener("addstream", handleAddStream); // 원격 스트림 추가 이벤트 핸들러 등록


  console.log(`myStream.getTracks() = ${JSON.stringify(myStream.getTracks())}`)
  myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream)); // 스트림의 모든 트랙을 RTCPeerConnection에 추가
}

function handleIce(data) {
  console.log(`■■■■■■■■■■■■■ handleIce.......................`)
  console.log(`■■■■■■■■■■■■■ data=${data}`)
  
}


// 방 입장 이벤트 핸들러 
async function handleWelcomeSubmit(event) {
  console.log(`■■■■ handleWelcomeSubmit ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)
  console.log(`■■■■ handleWelcomeSubmit ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ event=${event.target.textContent}`)
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  console.log(`■■■■ handleWelcomeSubmit ■■■■ initCall() ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)
  await initCall(); // 방 입장 전에 미디어 스트림 확보 및 RTCPeerConnection 생성
  console.log(`■■■■ handleWelcomeSubmit ■■■■ // initCall() ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)

  roomName = input.value.trim();
  console.log(`■■■■■■ [handleWelcomeSubmit] ::: roomName=${roomName}`)
  if (roomName) {
    // socket.emit("join_room", roomName, startMedia);
    socket.emit("join_room", roomName);
  console.log(`■■■■ handleWelcomeSubmit ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ emit ■■ join_room ■■■ `)

    input.value = ""; // 입력 필드 초기화
  }
}
welcomeForm.addEventListener("submit", handleWelcomeSubmit);





async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach(camera => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.textContent = camera.label || `Camera ${cameraSelect.length + 1}`;
      if (currentCamera.label == camera.label) {
        console.log(`${currentCamera.label}`)
        console.log(`${camera.label}`)
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });

    console.log('getCameras ::: cameras =', cameras);
    console.log('getCameras ::: currentCamera =', currentCamera);
  } catch (error) {
    console.error("Error occurred while enumerating media devices.", error);
  }
}


async function getMedia(deviceId) {
  console.log(`deviceId=====================${deviceId}`)
    // const initialConstraints = {
    //   audio: true,
    //   video: { facingMode: "user" }
    // };
    const cameraConstraints = {
      audio: true,
      video: deviceId ? { deviceId: { exact: deviceId } } :  { facingMode: "user" }
    };
    console.log(`cameraConstraints=JS${JSON.stringify(cameraConstraints) }`)
    // const constraints = deviceId ? cameraConstraints : initialConstraints;
  try {
    myStream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
    console.log(myStream)
    myFace.srcObject = myStream; // 비디오 요소에 스트림 연결
    if (!deviceId) {
      await getCameras(); // 카메라 목록 가져오기
    }
  } catch (error) {
    console.error("Error accessing media devices.", error);
  } 
}

document.addEventListener("DOMContentLoaded", () => {
  // getMedia(); // 기본 카메라 스트림 확보 + 카메라 목록 채우기
});


// async function handleCameraChange() {
//   const selectedCameraId = cameraSelect.value;
//   console.log('handleCameraChange ::: selectedCameraId =', selectedCameraId); 
//   await getMedia(selectedCameraId); // 선택된 카메라 ID로 미디어 스트림 업데이트
// }

async function handleCameraChange() {
  const selectedCameraId = cameraSelect.value;
  console.log('handleCameraChange ::: selectedCameraId =', selectedCameraId); 
  await getMedia(selectedCameraId); // 선택된 카메라 ID로 미디어 스트림 업데이트
}
cameraSelect.addEventListener("input", handleCameraChange);


function handleMuteClick() {

  console.log('handleMuteClick ::: myStream =', myStream) 
  console.log('handleMuteClick ::: myStream.getAudioTracks() =', myStream.getAudioTracks()) 

  myStream.getAudioTracks().forEach(track => console.log('handleMuteClick ::: track.enabled =', track.enabled))


  if (!myStream) return; // myStream이 아직 초기화되지 않은 경우 함수 종료  
  myStream.getAudioTracks().forEach(track => track.enabled = muted); // 음소거 상태에 따라 오디오 트랙 활성화/비활성화
  if (!muted) {
    muteButton.textContent = "Unmute";
  } else {
    muteButton.textContent = "Mute";
  } 
  muted = !muted; // 음소거 상태 토글
}
muteButton.addEventListener("click", handleMuteClick);


function handleCameraClick() {
  console.log('handleCameraClick ::: myStream =', myStream)
  console.log('handleCameraClick ::: myStream.getVideoTracks() =', myStream.getVideoTracks())
  myStream.getVideoTracks().forEach(track => console.log('handleCameraClick ::: track.enabled =', track.enabled))

  if (!myStream) return; // myStream이 아직 초기화되지 않은 경우 함수 종료  
  myStream.getVideoTracks().forEach(track => track.enabled = cameraOff); // 카메라 상태에 따라 비디오 트랙 활성화/비활성화
  if (!cameraOff) {
    cameraButton.textContent = "Turn Camera On";
  } else {
    cameraButton.textContent = "Turn Camera Off";
  } 
  cameraOff = !cameraOff; // 카메라 상태 토글
}
cameraButton.addEventListener("click", handleCameraClick);  


// 방 입장 이벤트 처리
socket.on("welcome", async () => {
  
    console.log(`■■ welcome ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■FROM SERVER ■■■■ EMIT ■■ welcome`)

  // const offer = await myPeerConnection.createOffer();
  // myPeerConnection.setLocalDescription(offer);
  // console.log(`sent the offer to the server...offer=${ JSON.stringify(offer)}`)
  // console.log(`sent the offer to the server...roomName=${roomName}`)
  // console.log(`■■ welcome ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■  ■■■■ EMIT ■■ offer roomName=${roomName}`)
  // socket.emit("offer", offer, roomName);
  // console.log(`// ■■ welcome ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■   ■■■■ EMIT ■■ offer`)
});

// socket.on("welcome", (userNickname, newCount) => {
//   console.log("■ ■ ■ ■ 웰컴 to Socket.IO server with ID:", socket.id);
//   console.log("■ ■ ■ ■ 웰컴 to Socket.IO server with ID:", socket.id);
//   console.log("■ ■ ■ ■ 웰컴 to Socket.IO server with ID:", socket.id);
//   console.log("■ ■ ■ ■ 웰컴 to Socket.IO server with ID:", socket.id);
//   const h3 = room.querySelector("h3");
//   h3.textContent = `Room: ${roomName} (${newCount})`; // 방 이름과 인원 수 업데이트

//   addMessage(`■ ■ ■ ■ ${userNickname} arrived`); // 연결이 성공한 후에 이벤트 등록

// });


socket.on("offer", async (offer) => {
  // console.log(`■ ■ ■ ■ offer from server Socket.IO   offer=${JSON.stringify(offer)}`)
  console.log(`■ ■ ■ ■ offer from server Socket.IO   offer=${(offer)}`,offer)
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);

  
  console.log(`emit ■ answer ■■■■■■■■■■■■■■■■■■■■■■■■■■■■`)
  socket.emit("answer", answer, roomName);
  // console.log(`■ ■ ■ ■ offer from server Socket.IO   answer=${JSON.stringify(answer)}`)
  console.log(`■ ■ ■ ■ offer from server Socket.IO   answer=${(answer)}`,answer)
  console.log(`■ ■ ■ ■ offer from server Socket.IO   roomName=${JSON.stringify(roomName)}`)

});


socket.on("answer", async (answer) => {
  console.log(`■ ■ ■ ■ answer from server Socket.IO   answer=${JSON.stringify(answer)}`)
  myPeerConnection.setRemoteDescription(answer);
});


socket.on("bye", (userNickname, newCount) => {
  console.log('■ ■ ■ ■ bye ■ ■ ■ ■ ■  userNickname =', userNickname)
  console.log("■ ■ ■ ■ bye to Socket.IO server with ID:", socket.id);
  const h3 = room.querySelector("h3");
  h3.textContent = `Room: ${roomName} (${newCount})`; // 방 이름과 인원 수 업데이트
  addMessage(`${userNickname} left`); // 연결이 성공한 후에 이벤트 등록
});


socket.on("new_message", (msg) => {
  console.log('■ ■ ■ ■ new_message ■ ■ ■ ■ ■ ')
  console.log("new_message to Socket.IO server with ID:", socket.id);
  addMessage(` ${msg}`); // 연결이 성공한 후에 이벤트 등록
});


socket.on("room_change", (rooms) => {
  console.log(`■ ■ ■ ■ room_change ■ ■ ■ ■ ■  rooms = ${JSON.stringify(rooms)}`);
  console.log(`■ ■ ■ ■ room_change ■ ■ ■ ■ ■  rooms = rooms`);
  console.log(`■ ■ ■ ■ room_change ■ ■ ■ ■ ■  socket.id = socket.id`);

  const roomList = document.getElementById("roomList");
  
  roomList.innerHTML = ""; // 기존 방 목록 초기화

  if (rooms.length === 0) {
    return; // 방이 없으면 목록을 비워둡니다.
  }

  rooms.forEach(room => {
    const li = document.createElement("li");
    li.textContent = room;
    roomList.appendChild(li);
  });

});

// socket.on("connect", () => {
//   console.log("Connected to Socket.IO server with ID:", socket.id);
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected from Socket.IO server.");
// });   






const room = document.getElementById("room");

const nickRoom = room.querySelector("#name");
const msgRoom = room.querySelector("#msg");


// room.hidden = true; // 초기에는 채팅방 숨김


// 메시지 추가 함수
function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.textContent = message;
  ul.appendChild(li);

} 







// 방 입장 후 UI 업데이트 함수
function showRoom() {
  console.log(`Entered room: ${roomName}`);
  // 방에 입장한 후 필요한 UI 업데이트를 여기에 추가할 수 있습니다.
  // 예: 채팅 인터페이스 표시, 방 이름 업데이트 등
  console.log('■ ■ ■ ■ ■ server is ok..........')
  
  const roomTitle = room.querySelector("h3");
  const input = room.querySelector("input");
  roomTitle.textContent = `Room: ${roomName}`;
  // room.hidden = false;
  room.style.display = "block";
  welcome.hidden = true;    
  input.focus(); // 메시지 입력 필드에 포커스
}










// 방 입장 이벤트 핸들러 
function handleEnterRoomSubmit(event) {
  console.log('Enter Room ::: event=',event.target.textContent)
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  roomName = input.value.trim();
  if (roomName) {
    socket.emit("enter_room", { roomName}, showRoom);
    input.value = ""; // 입력 필드 초기화
  }
}
// welcomeForm.addEventListener("submit", handleEnterRoomSubmit);



// 닉네임 제출 이벤트 핸들러
function handleNicknameSubmit(event) {
  console.log('Enter nickname ::: event=',event.target)
  console.log('Enter nickname ::: event=',event)
  
  event.preventDefault();
  const input = room.querySelector("#name input");
  const value = input.value.trim();
  if (value) {
    console.log('Enter nickname ::: value=',value)
    socket.emit("nickname",value);
    input.value = ""; // 입력 필드 초기화
  }
}
nickRoom.addEventListener("submit", handleNicknameSubmit);



// 메시지 제출 이벤트 핸들러
function handleMessageSubmit(event) {
  console.log('Enter msg ::: event=',event.target)
  console.log('Enter msg ::: event=',event)

  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value.trim();
  if (value) {
    console.log('Enter msg ::: value=',value)
    socket.emit("new_message",value,  roomName, () =>{
      addMessage(`You: ${value}`);
    });
    input.value = ""; // 입력 필드 초기화
    input.focus(); // 메시지 입력 필드에 포커스 유지
  }
}
msgRoom.addEventListener("submit", handleMessageSubmit);

