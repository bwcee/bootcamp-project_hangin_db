import BaseController from "./baseCtrl.mjs";

export default class ChatController extends BaseController {
  constructor(model, salt) {
    super(model, salt);
  }

  async getChats(req, res) {
    const { taskId, taskOwner, taskPartner } = req.params;
    try {
      const history = await this.model
        .find({ task: taskId })
        .where({ sender: { $in: [taskOwner, taskPartner] } })
        .where({ receiver: { $in: [taskOwner, taskPartner] } })
        .exec();
      res.send(history);
    } catch (err) {
      let msg = "";
      this.errorHandler(err, msg, res);
    }
  }
}

//   const chatSchema = new Schema(
//   {
//     sender: { type: Schema.Types.ObjectId, ref: "User" },
//     receiver: { type: Schema.Types.ObjectId, ref: "User" },
//     task: {type: Schema.Types.ObjectId, ref: "Task"},
//     msg: { type: String, lowercase: true, trim: true },
//   },
//   { timestamps: true }
// );
