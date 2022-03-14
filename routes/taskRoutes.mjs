import express from "express";

const taskRouters = express.Router();

export default function taskRouteFunc(controller) {
  taskRouters.post("/addNewTask", controller.addTask.bind(controller));
  taskRouters.post("/getAllTask", controller.getAllTask.bind(controller));
  return taskRouters;
}
