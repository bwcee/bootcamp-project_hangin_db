import mongoose from "mongoose";
const { Schema, model } = mongoose;

/* 
1. temp collection to store info abt who is online 
2. no need for timestamps here or ref to underlying models, since just temp storage
*/
const onlineSchema = new Schema({
  socketId: { type: String },
  userId: { type: String },
});

export default model("Online", onlineSchema);
