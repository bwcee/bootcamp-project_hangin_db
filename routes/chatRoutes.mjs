import express from "express";

const chatRouters = express.Router();

export default function chatRouteFunc(controller) {
  chatRouters.get(
    "/:taskId/:taskOwner/:taskPartner",
    controller.getChats.bind(controller)
  );

  return chatRouters;
}
