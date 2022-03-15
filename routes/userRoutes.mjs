import express from "express";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/pics/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const multerUpload = multer({ storage: storage });

const userRouters = express.Router();

export default function userRouteFunc(controller) {
  /* nb: "profilePic" is value used in appending image file to formdata in frontend */
  userRouters.put(
    "/pic",
    multerUpload.single("profilePic"),
    controller.updateProfilePic.bind(controller)
  );

  userRouters.put("/name", controller.updateName.bind(controller));
  // userRouters.put("/email", multerUpload.none(), controller.updateEmail.bind(controller));
  // userRouters.put("/bio", multerUpload.none(), controller.updateBio.bind(controller));
  // userRouters.put("/postal", multerUpload.none(), controller.updatePostal.bind(controller));

  return userRouters;
}
