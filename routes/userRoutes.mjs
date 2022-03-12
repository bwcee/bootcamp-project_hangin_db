import express from "express";

const userRouters = express.Router();

export default function userRouteFunc(controller) {
  userRouters.get("/profile", controller.getProfile.bind(controller));
  
  return userRouters;
}