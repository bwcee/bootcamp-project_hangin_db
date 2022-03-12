import mongoose from "mongoose";
const { Schema, model } = mongoose;

/* from Mongoose docs, {VALUE} below will be replaced by value being validated */
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
    owner: { type: Schema.Types.ObjectId, ref: "User" }, //task owner id 
    partner: { type: Schema.Types.ObjectId, ref: "User" },//accountability partner id, default will be owner id or null? i.e. nil accountability partner
    endText: { type: String, lowercase: true, trim: true },//free text reward/penalty for completing/not completing task [optional field]
    endAmt: { type: Number },//penalty amt to pay if fail to complete task [optional field]
    endApplied: { type: Boolean },//if chose to haf reward/penalty, haf those been applied 
    endIndicated: { type: Boolean },//owner indicated task is completed... this shld trigger something on accountability partner side...
    completed: { type: Boolean },//mark task as completed either by owner or accountability partner
    completion: { type: Date },//target completion date
  },
  { timestamps: true }
);

export default model("Task", taskSchema);