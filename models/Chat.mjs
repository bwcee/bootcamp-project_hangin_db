import mongoose from "mongoose";
const { Schema, model } = mongoose;

/* 
1. referencing User and Task models allow populating queries later if needed 
2. need to ref Task model here... mebbe can haf chat interface like carousell's 
3. ref for simplified chat set-up (https://github.com/neelabhsinha/Private-Chat-Application-using-MongoDB-and-Socket.io)
*/
const chatSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    task: {type: Schema.Types.ObjectId, ref: "Task"},
    msg: { type: String, lowercase: true, trim: true },
  },
  { timestamps: true }
);

export default model("Chat", chatSchema);
