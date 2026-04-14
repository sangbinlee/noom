import http from "http";
import express from "express";
import { configureApp } from "./set.js";
import { initSocketServer } from "./socketHandler.js";
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
import  {Server  } from 'socket.io'
import  {instrument  } from '@socket.io/admin-ui'

// Express 설정
configureApp(app);

// WebSocket 서버 초기화 (합쳐진 버전) 
// initSocketServer(server);

// socket.io  버전은 별도로 설정
const wsServer = new Server(server, { 
  cors: { 
    origin: [
      "*",
      "https://chat.dev9.shop",
      // "https://admin.socket.io",
    ],
    // methods: ["GET", "POST"],
    // credentials: true
  },
});



instrument(wsServer, {
  // auth: {
  //   type: "basic",
  //   username: "admin",
  //   password: "admin",
  // }
  auth: false
});




// WebSocket 이벤트 처리
wsServer.on("connection", (socket) => {



  console.log(`■???? ■ connection ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)
  console.log(`■■ connection ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)
  console.log(`■■ connection ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■  Socket.IO ■ socket.id=${socket.id}`);  

  socket.on("disconnecting", (nickname) => {  
  console.log(`■ 1 ■ disconnecting ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)
    console.log(`■ ■ ■ ■ ■ ■ ■ ■ ■  ■ disconnecting  ■ ■ ■ ■ ■ ■ ■ ■ 
      ■ nickname = ${nickname}
    , ■ socket.id = ${socket.id} 
    , ■ rooms = ${JSON.stringify(socket.rooms)}`);
    socket.rooms.forEach(room => {
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1); // 나가는 사람의 닉네임과 남은 인원 수 전달
        console.log(`//■ ■ ■ ■ ■ ■ ■ ■ ■  ■ disconnecting  ■ ■ ■ ■ ■ ■ ■ ■`)
    });
  console.log(`//■ 1 ■ disconnecting ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)
  });
  
  // disconnect 이벤트 처리
  socket.on("disconnect", () => {
  console.log(`■ 2 ■ disconnect ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)
    console.log(`■  disconnect ■■■■■■■■■■■■■■■■■■■■■  socket.id=${socket.id}`  );
    wsServer.sockets.emit("room_change", publicRooms());
    console.log(`■  disconnect ■■■■■■■■■■■■■■■■■ emit ■■ room_change ■■  publicRooms()=${publicRooms()}`  );
    console.log(`//■  disconnect ■■■■■■■■■■■■■■■■■■■■■  socket.id=${socket.id}`  );
  console.log(`//■ 2 ■ disconnect ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)
  });
 










  socket.onAny((event) => {
    console.log(`■■ onAny ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)
    console.log(`■■ onAny ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ event: ■ ${JSON.stringify(event)}`)
  }); 

  socket.on("join_room", (roomName) => {
    console.log(`■■ join_room ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)
    console.log(`■■ join_room ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ roomName=${roomName}  , socket.id=${socket.id}`)
    socket.join(roomName);
    // done();

    // socket.to(roomName).emit("welcome");
    console.log(`■■ join_room ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ EMIT ■■ welcome`)
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    // wsServer.sockets.emit("room_change", publicRooms());
  });


  socket.on("offer", (offer, roomName) => {
    console.log(`xxxxxxxxxxxxx offer =${offer}`)
    console.log(`xxxxxxxxxxxxx offer =${(offer) }`, offer)
    // console.log(`xxxxxxxxxxxxx offer =${JSON.stringify(offer) }`)

    socket.to(roomName).emit("offer", offer);  
  });



  socket.on("answer", (answer, roomName) => {
    console.log(`xx answer xxxxxxxxxxx roomName =${roomName}`)
    console.log(`xx answer xxxxxxxxxxx answer =${(answer)}`)
    // console.log(`xx answer xxxxxxxxxxx answer =${JSON.stringify(answer)}`)

    socket.to(roomName).emit("answer", answer);
  });









  socket['nickname'] = "Anonymous"; // 기본 닉네임 설정


  // enter_room 이벤트 처리
  socket.on("enter_room", (obj, callback) => {
    
    console.log(`■ ■ ■ ■ ■ ■ ■ ■ ■  ■ enter_room  ■ ■ ■ ■ ■ ■ ■ ■ 
      ■ obj =${JSON.stringify(obj)}
    , ■ socket.id = ${socket.id} 
    , ■ rooms = ${JSON.stringify(socket.rooms)}`);

    const roomName = obj.roomName;
    console.log('■ ■ ■ ■ ■ ■ ■ ■ ■ roomName ■ ■ ■ ■ ■ ■ ■ ■ ■  ')
    console.log(roomName)
    console.log('■ ■ ■ ■ ■ ■ ■ ■ ■ id ■ ■ ■ ■ ■ ■ ■ ■ ■  ')
    console.log(socket.id)
    console.log('■ ■ ■ ■ ■ ■ ■ ■ ■ rooms ■ ■ ■ ■ ■ ■ ■ ■ ■  ')
    console.log(socket.rooms)
    console.log('■ ■ ■ ■ ■ ■ ■ ■ ■ join ■ ■ ■ ■ ■ ■ ■ ■ ■  ')
    socket.join(roomName);
    console.log('■ ■ ■ ■ ■ ■ ■ ■ ■ to ■ ■ ■ ■ ■ ■ ■ ■ ■  ')
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));


    wsServer.sockets.emit("room_change", publicRooms());

    console.log('■ ■ ■ ■ ■ ■ ■ ■ ■ rooms ■ ■ ■ ■ ■ ■ ■ ■ ■  ')
    console.log(socket.rooms)
    console.log('■ ■ ■ ■ ■ ■ ■ ■ ■ ')
    
    setTimeout(() => {
      callback(); // 클라이언트에게 입장 완료 알림
    }, 0  );
  });




  // 메시지 이벤트 처리
  socket.on("new_message", (msg, roomName, callback) => {
    console.log('■  new_message ■ ■ ■ ■ ■ ■ ■ ■ ■  ■ ■ ■ ■ ■ ■  msg=', msg );
    console.log('■  new_message ■ ■ ■ ■ ■ ■ ■ ■ ■  ■ ■ ■ ■ ■ ■  roomName=', roomName );
    socket.to(roomName).emit("new_message", `${socket.nickname}: ${msg  }`);

    callback();
  });

  // nickname 이벤트 처리
  socket.on("nickname", (nickname) => {
    console.log('■  nickname ■ ■ ■ ■ ■ ■ ■ ■ ■  ■ ■ ■ ■ ■ ■  nickname='  , nickname);
    socket['nickname'] = nickname;
  });



});



server.listen(PORT, () => {
  console.log(`1 ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ server.js .... listening on http://localhost:${PORT}`);
});



// public  

function publicRooms() {
  
  console.log(`■■ publicRooms ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)
  console.log(`//■■ publicRooms ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ `)
  // const  sids = wsServer.sockets.adapter.sids;
  // const  rooms = wsServer.sockets.adapter.rooms; 
  const { sids, rooms } = wsServer.sockets.adapter;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    console.log(`■■ publicRooms ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■  key=${key}`)
    if (!sids[key]) {
      publicRooms.push(key);
    } 
  });

  console.log(`//■■ publicRooms 1 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ publicRooms=${publicRooms}`)
  return publicRooms;
}

function countRoom(roomName) {

  console.log('roomName=',roomName)
  const count = wsServer.sockets.adapter.rooms.get(roomName)?.size || 0;
  console.log('■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ count=',count) 
  return count;
}




