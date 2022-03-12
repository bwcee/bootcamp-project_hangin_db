import express from "express";
import mongoose from "mongoose";
import cors from "cors";
/* import verifyToken middleware */
import verifyToken from "./middlewares/auth.mjs";
/* get SALT here and pass it as argument to controllers below */
import dotenv from "dotenv";
dotenv.config();
const { SALT, DATABASE_URL, FRONTEND_URL, PORT } = process.env;
/* 
1. this is all tt is needed to create connection to our db 
2. the funky syntax in console.log/error just to print out in color so easier to see
*/
mongoose
  .connect(DATABASE_URL)
  .then(() =>
    console.log("\x1b[34m%s\x1b[0m", "sucessfully connected to mongodb!!")
  )
  .catch((err) => {
    console.error("\x1b[41m%s\x1b[0m", "error connecting to mongodb!!");
    console.error("\x1b[41m%s\x1b[0m", err);
  });
/* import models */
import User from "./models/User.mjs";
import Task from "./models/Task.mjs";
import Chat from "./models/Chat.mjs";

/* import routes & controllers */
import signRoutes from "./routes/signRoutes.mjs";
import SignController from "./controllers/signCtrl.mjs";
/* initiate/create instance of controllers & pass in models and SALT so can do jwt verification*/
const signControl = new SignController(User, SALT);
/* initialise express instance */
const app = express();

/* middlewares to use */
app.use(express.urlencoded({ extended: false })); // handle req.body from form requests
app.use(express.json()); // handle json from axios post requests
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
); // prevent cross-origin resource sharing error when react app eventually tries to make calls to this server

/* expose files stored in public folder */
app.use(express.static("public"));

/* make use of defined routes */
app.use("/", signRoutes(signControl));
/* middleware placed here so all routes below will haf to be verified first*/
app.use(verifyToken());
// app.use("/class", klassRoutes(klassControl));

// Set Express to listen on the given port
app.listen(PORT || 3004, () => {
  console.log(`bckend server is running on ${PORT}`);
});
