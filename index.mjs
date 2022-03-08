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
2. the funky syntax in console.log/err just to print out in color so easier to see
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
/* 
1. unlike sequelize, no need ./models/index.js to create and export db  
2. just need to import models here
3. from mongoose docs: "Every model has an associated connection. When you use mongoose.model(), your model will use the default mongoose connection."
the default connection is on line 8: mongoose.connect("mongodb://localhost:27017/zoom_dev")
*/

/* import routes & controllers */

/* initiate/create instance of controllers & pass in models and SALT so can do jwt verification*/

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
// app.use("/", homeRoutes(homeControl));
/* middleware placed here so all routes below will haf to be verified first*/
app.use(verifyToken());
// app.use("/class", klassRoutes(klassControl));

// Set Express to listen on the given port
app.listen(PORT || 3004, () => {
  console.log(`bckend server is running on ${PORT}`);
});
