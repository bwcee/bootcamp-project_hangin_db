import mongoose from "mongoose";
import User from "../models/User.mjs";
import bcrypt from "bcrypt";

const hash = bcrypt.hashSync("123", 8);

import dotenv from "dotenv";
dotenv.config();
const { DATABASE_URL } = process.env;
/* 
1. need to put the connection here cos this file runs independently of index.mjs in root folder where connection defined 
2. placed a seed script in package.json so just need to [npm run seed] to run this file
*/

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("successfully connected to mongodb!!"))
  .catch((err) => console.error("error in connecting to mongodb!!", err));

const userSeeds = [
  {
    name: "justus",
    email: "justus@passerby.com",
    password: hash,
    bio: "this is justus bio sentence.",
    postal: "01"
  },
  {
    name: "gary",
    email: "gary@passerby.com",
    password: hash,
    bio: "this is gary's bio sentence.",
    postal: "03"
  },
  {
    name: "boon wee",
    email: "bw@passerby.com",
    password: hash,
    bio: "this is bw's bio sentence.",
    postal: "05"
  },
  ];

/* 
1. use deleteMany to delete all prev records first b4 seeding 
2. have to use awaits otherwise will jump to closing connx and inserts/queries will fail 
3. close the connection otherwise terminal will be left hanging w an open mongodb connection 
*/
await User.deleteMany({});
const users = await User.insertMany(userSeeds);
console.log("This is result of insertMany", users);
const allUsers = await User.find().select("name").exec();
console.log("These are all users in the db", allUsers);
mongoose.connection.close();
