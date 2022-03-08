import mongoose from "mongoose";
const { Schema, model } = mongoose;

/* 
1. from Mongoose docs, {VALUE} below will be replaced by value being validated
2. default value of partner will be owner's id, this will be handled at the front end
*/
const taskSchema = new Schema(
  {
    description: { type: String, required: true, lowercase: true, trim: true },
    tag: {
      type: String,
      required: true,
      enum: {
        values: [
          "studies",
          "exercise",
          "work",
          "housechores",
          "finance",
          "health",
          "wellness",
          "creativity",
        ],
        message: "{VALUE} is not a valid task type",
      },
    },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    partner: { type: Schema.Types.ObjectId, ref: "User" },
    endText: { type: String, lowercase: true, trim: true },
    endAmt: { type: Number },
    endApplied: { type: Boolean },
    completed: { type: Boolean },
    completion: { type: Date },
  },
  { timestamps: true }
);

export default model("Task", taskSchema);
