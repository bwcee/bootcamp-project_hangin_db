import express from "express";

const signRouters = express.Router();

export default function signRouteFunc(controller) {
  signRouters.post("/", controller.doLogIn.bind(controller));
  signRouters.post("/signup", controller.doSignUp.bind(controller));
  
  return signRouters;
}
