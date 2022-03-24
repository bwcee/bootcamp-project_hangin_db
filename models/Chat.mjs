import mongoose from "mongoose";
const { Schema, model } = mongoose;

/* 
1. referencing User and Task models allow populating queries later if needed 
2. need to ref Task model here... mebbe can haf chat interface like carousell's 
3. ref for simplified chat set-up (https://github.com/neelabhsinha/Private-Chat-Application-using-MongoDB-and-Socket.io)
4. no need for collection to keep track of who is online. tt can be done either thru a global variable here in the bckend, or thru a state in the frontend?
*/
const chatSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    task: { type: Schema.Types.ObjectId, ref: "Task" },
    msg: { type: String, trim: true },
  },
  { timestamps: true }
);

export default model("Chat", chatSchema);
