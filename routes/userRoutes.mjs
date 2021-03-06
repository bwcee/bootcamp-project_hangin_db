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
  userRouters.get("/getUser/:id", controller.getUser.bind(controller));
  userRouters.get("/getAllUsers/:id", controller.getAllUsers.bind(controller));
  userRouters.put(
    "/pic",
    multerUpload.single("profilePic"),
    controller.updateProfilePic.bind(controller)
  );
  userRouters.put("/addRequest", controller.addRequest.bind(controller));
  userRouters.put("/name", controller.updateName.bind(controller));
  userRouters.put("/email", controller.updateEmail.bind(controller));
  userRouters.put("/bio", controller.updateBio.bind(controller));
  userRouters.put("/postal", controller.updatePostal.bind(controller));
  userRouters.put("/password", controller.updatePassword.bind(controller));
  userRouters.post("/secret", controller.getClientSecret.bind(controller));
  userRouters.post(
    "/payment-intent",
    controller.getPaymentSecret.bind(controller)
  );
  userRouters.post(
    "/payment-methods",
    controller.getPaymentMethod.bind(controller)
  );

  return userRouters;
}
