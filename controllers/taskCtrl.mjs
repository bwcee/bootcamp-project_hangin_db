import BaseController from "./baseCtrl.mjs";
import { resolve } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class TaskController extends BaseController {
  constructor(model, salt) {
    super(model, salt);
  }

  async addTask(req, res) {
    const { owner, financialPenalty, taskDescription, taskTag, rewardsPenalty, partner, dateTime } = req.body

    console.log("backend data received", req.body)
    try {
      const newTask = await this.model.create({
        description: taskDescription,
        taskTag,
        owner,
        partner,
        endText: rewardsPenalty, // String for rewardsPenalty description
        financialPenalty, //Boolean value if financial penalty applied
        endApplied: false, // Default new task is false for reward/penalty
        endIndicated: false, // Default new task is false for task completion to partner
        completed: false, //Default new task is false for task completion - self
        completion: dateTime //DateTime for task completion
      })
      res.send(newTask);

    } catch (err) {
      this.errorHandler(err)
    }
  }

  async getAllTask(req, res) {
    const { id } = req.body
    console.log("backend data received", req.body)
    try {
      const getTask = await this.model.find({
        owner: id
      })
      res.send(getTask);

    } catch (err) {
      this.errorHandler(err)
    }
  }

}