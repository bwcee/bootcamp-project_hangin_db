import express from "express";

const taskRouters = express.Router();

export default function taskRouteFunc(controller) {
  taskRouters.post("/addNewTask", controller.addTask.bind(controller));
  taskRouters.get("/getAllTask/:id", controller.getAllTask.bind(controller));
  taskRouters.get("/PartnerTasks/:id", controller.getPartnerTasks.bind(controller));
  taskRouters.post("/completeTask", controller.completeTask.bind(controller));
  return taskRouters;
}
