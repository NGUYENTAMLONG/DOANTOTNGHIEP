function handleSocket(io, room, notification) {
  // io.on("connection", function (socket) {
  //   console.log("Connected Socket!", socket.id);
  //   socket.emit(room, notification);
  // });
  io.emit(room, notification);
}
const connectedUsers = [];
function storeConnectSocket(userId, socketId) {
  //checkUserExist
  if (!userId) {
    return;
  }
  const found = connectedUsers.filter((user) => user.userId === userId);
  if (found.length === 0) {
    // console.log({ found });
    connectedUsers.push({
      userId: userId.toString(),
      socketId,
    });
  } else {
    return;
  }
  // console.log(connectedUsers);
}
console.log(connectedUsers);
module.exports = { handleSocket, storeConnectSocket, connectedUsers };
