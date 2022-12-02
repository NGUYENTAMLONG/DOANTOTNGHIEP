function handleSocket(io, room, notification) {
  // io.on("connection", function (socket) {
  //   console.log("Connected Socket!", socket.id);
  //   socket.emit(room, notification);
  // });
  io.emit(room, notification);
}

module.exports = { handleSocket };
