import Chat from "../models/Chat.mjs";

let usersOnline = {};

export default function chatHandlers(io, socket) {
  const startChat = (data) => {
    const { taskId, sender } = data;
    /* join room so can subscribe to events emitted to this room, think this works cos ea socket is given a unique id */
    socket.join(taskId);
    /* saving sender id as obj in usersOnline since easier to add/locate/delete key-value pairs */
    usersOnline[sender] = sender;
  };

  const bdcastMsg = async (data) => {
    const { taskId, msg, receiver, sender } = data;
    const storedMsg = await Chat.create({ sender, receiver, task: taskId, msg });
    data.timeStamp = storedMsg.createdAt
    io.to(taskId).emit("bdcast_msg", data);
  };

  socket.on("start_chat", startChat);
  socket.on("send_msg", bdcastMsg);
  socket.on("disconnect", () => {
    usersOnline = {};
  });
}

// const chatSchema = new Schema(
//   {
//     sender: { type: Schema.Types.ObjectId, ref: "User" },
//     receiver: { type: Schema.Types.ObjectId, ref: "User" },
//     task: {type: Schema.Types.ObjectId, ref: "Task"},
//     msg: { type: String, lowercase: true, trim: true },
//   },
//   { timestamps: true }
// );
