export default function chatHandlers (io, socket) {
  const testingConnx = (data) => {
    return console.log(data.msg);
  };

  socket.on("testing", testingConnx);
};


