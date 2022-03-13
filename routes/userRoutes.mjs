import express from "express";
import multer from "multer";

const multerUpload = multer({ dest: "public/pics/" });

const userRouters = express.Router();

export default function userRouteFunc(controller) {
  /* nb: "profilePic" is value of name field in <TextField> at frontend */
  userRouters.post(
    "/pic",
    multerUpload.single("profilePic"),
    controller.updateProfilePic.bind(controller)
  );

  return userRouters;
}
