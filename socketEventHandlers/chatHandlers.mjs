let usersOnline = {};

export default function chatHandlers(io, socket) {
  const startChat = (data) => {
    const { taskId, sender } = data;
    /* join room so can subscribe to events emitted to this room, think this works cos ea socket is given a unique id */
    socket.join(taskId);
    /* saving sender id as obj in usersOnline since easier to add/locate/delete key-value pairs */
    usersOnline[sender] = sender;
  };

  const bdcastMsg = (data) => {
    const { taskId } = data;
    io.to(taskId).emit("bdcast_msg", data);
  };

  socket.on("start_chat", startChat);
  socket.on("send_msg", bdcastMsg);
  socket.on("disconnect", () => {
    usersOnline = {};
  });
}
