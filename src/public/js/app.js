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


function startMedia() {
  
  welcome.hidden = true; // welcome 요소 숨김
  call.hidden = false; // call 요소 표시
  getMedia(); // 미디어 스트림 확보 및 카메라 목록 가져오기

  // navigator.mediaDevices.getUserMedia({ 
  //   audio: true,    
  //   video: { facingMode: "user" } 
  // })
  // .then(stream => {
  //   myStream = stream; // myStream 변수에 스트림 할당
  //   myFace.srcObject = stream;  
  //   call.style.display = "block"; // call 요소 표시
  //   getCameras(); // 카메라 목록 가져오기
  // })
  // .catch(error => {
  //   console.error("Error accessing media devices.", error);
  // }); 
}

// startMedia(); // 미디어 스트림 시작



// 방 입장 이벤트 핸들러 
function handleWelcomeSubmit(event) {
  console.log('Enter Room ::: event=',event.target.textContent)
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  roomName = input.value.trim();
  if (roomName) {
    socket.emit("join_room", roomName, startMedia);
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


async function getMedia(devicedId) {
    // const initialConstraints = {
    //   audio: true,
    //   video: { facingMode: "user" }
    // };
    const cameraConstraints = {
      audio: true,
      video: devicedId ? { deviceId: { exact: devicedId } } :  { facingMode: "user" }
    };
    console.log(`cameraConstraints=${cameraConstraints}`)
    // const constraints = devicedId ? cameraConstraints : initialConstraints;
  try {
    myStream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
    console.log(myStream)
    myFace.srcObject = myStream; // 비디오 요소에 스트림 연결
    if (!devicedId) {
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


  // const videoTrack = myStream.getVideoTracks()[0];
  // // const constraints = {
  // //   video: { deviceId: { exact: selectedCameraId } },
  // //   audio: true
  // // };

  // const initialConstraints = {
  //   audio: true,
  //   video: { facingMode: "user" }
  // };
  // const cameraConstraints = {
  //   audio: true,
  //   video: { deviceId: { exact: selectedCameraId } }
  // };
  // const constraints = selectedCameraId ? cameraConstraints : initialConstraints;


  // await navigator.mediaDevices.getUserMedia(constraints)
  //   .then(newStream => {
  //     const newVideoTrack = newStream.getVideoTracks()[0];
  //     myStream.removeTrack(videoTrack);
  //     myStream.addTrack(newVideoTrack);
  //     myFace.srcObject = myStream; // 비디오 요소에 업데이트된 스트림 연결
  //   })
  //   .catch(error => {
  //     console.error("Error occurred while changing camera.", error);
  //   }); 
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





socket.on("welcome", (userNickname, newCount) => {
  console.log("■ ■ ■ ■ welcome to Socket.IO server with ID:", socket.id);
  const h3 = room.querySelector("h3");
  h3.textContent = `Room: ${roomName} (${newCount})`; // 방 이름과 인원 수 업데이트

  addMessage(`■ ■ ■ ■ ${userNickname} arrived`); // 연결이 성공한 후에 이벤트 등록

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
  console.log(`■ ■ ■ ■ room_change ■ ■ ■ ■ ■  rooms = `, rooms);
  console.log("room_change to Socket.IO server with ID:", socket.id); 



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


let roomName = ""; // 현재 방 이름을 저장하는 변수
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

