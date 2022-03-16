import BaseController from "./baseCtrl.mjs";
import { resolve } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class TaskController extends BaseController {
  constructor(model, salt) {
    super(model, salt);
  }

  /**
   * Add New Task based on form submission from addtask page
   **/
  async addTask(req, res) {
    const {
      owner,
      financialPenalty,
      taskDescription,
      taskTag,
      rewardsPenalty,
      dateTime,
    } = req.body;

    console.log("backend data received", req.body);
    try {
      const newTask = await this.model.create({
        description: taskDescription,
        taskTag,
        owner,
        partner: null,
        partnerAccepted: "false", // Default string value for new task as no partner request
        endText: rewardsPenalty, // String for rewardsPenalty description
        financialPenalty, //Boolean value if financial penalty applied
        endApplied: false, // Default new task is false for reward/penalty
        endIndicated: false, // Default boolean is false for task completion to partner
        completed: false, //Default new task is false for task completion - self
        completion: dateTime, //DateTime for task completion
      });
      res.send(newTask);
    } catch (err) {
      this.errorHandler(err);
    }
  }

  /**
   * Get all of user own task from DB post-login to store in useState
   **/
  async getAllTask(req, res) {
    const { id } = req.params;
    try {
      const getOwnerTask = await this.model.find({
        owner: id,
      });

      res.send(getOwnerTask);
    } catch (err) {
      let msg = "";
      this.errorHandler(err, msg, res);
    }
  }

  /**
   * Get all task where user is accountability partner from DB post-login to store in useState
   **/
  async getPartnerTasks(req, res) {
    const { id } = req.params;
    try {
      const partnerTasks = await this.model
        .find({
          partner: id,
          completed: false,
        })
        .populate({ path: "owner", select: "_id name" })
        .exec();

      res.send(partnerTasks);
    } catch (err) {
      let msg = "";
      this.errorHandler(err, msg, res);
    }
  }

  /**
   * Task Completion Button functionality to manipulate based on existing task inputs
   **/
  async completeTask(req, res) {
    const { taskId } = req.body;
    try {
      // Find data based on task ID
      const findTask = await this.model.findById({ _id: taskId });

      console.log(findTask.partner);

      // If task partner = null (does not have partner), update completed = true
      if (!findTask.partner) {
        console.log(
          "----> Updating task to complete (No Accountability partner"
        );
        findTask.completed = true;
        await findTask.save();
        console.log("UPDATED)");
      } else {
        // If task partner != null, check endIndicated is false or true
        console.log("----> Task has accountability partner");
        if (findTask.endIndicated === false) {
          // (Scenario for user to state that task has been completed and route to accountability partner to click on complete) - current endIndicated is false, update endIndicated to true and return
          console.log(
            "----> Updating endIndicated to true - task pending partner to click as complete"
          );
          findTask.endIndicated = true;
          await findTask.save();
          console.log("UPDATED ENDINDICATED AS TRUE BUT TASK NOT COMPLETED");
        } else {
          // (Scenario for pending accountability partner to click on complete) - endIndicated is true, update task as completed is true
          console.log(
            "----> Updating Complete button clicked by partner to true and task completed"
          );
          findTask.completed = true;
          await findTask.save();
          console.log("UPDATED TASK AS COMPLETED");
        }
      }
      res.send(findTask);
    } catch (err) {
      this.errorHandler(err);
    }
  }

  async partnerRequest(req, res) {
    const { userId, taskId } = req.body;
    try {
      const task = await this.model.findById(taskId);
      task.partner = userId;
      task.partnerAccepted = "pending";
      task.save();
      console.log(task);
    } catch (err) {
      let msg = "";
      this.errorHandler(err, msg, res);
    }
  }
}
