import mongoose from "mongoose";
import User from "../models/User.mjs";
import Task from "../models/Task.mjs";
import bcrypt from "bcrypt";

const hash = bcrypt.hashSync("1", 8);

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

//////////////////////////////////////////////////////////////////
/* SEED USERS */
//////////////////////////////////////////////////////////////////
const userSeeds = [
  {
    name: "justus",
    email: "justus@",
    password: hash,
    pic: "22815623_1475944515827744_7501673232580506080_n-1647277983687.jpg",
    bio: "this is justus bio sentence.",
    postal: "01",
  },
  {
    name: "gary",
    email: "gary@",
    password: hash,
    pic: "hardhat-1647310300861.jpeg",
    bio: "this is gary's bio sentence.",
    postal: "03",
  },
  {
    name: "bw",
    email: "bw@",
    password: hash,
    pic: "A_very_small_house-1647238824268.jpg",
    bio: "this is bw's bio sentence.",
    postal: "05",
  },
  {
    name: "random passerby a",
    email: "rpa@",
    password: hash,
    pic: "logo-1647243129779.png",
    bio: "this is random passerby a's bio sentence.",
    postal: "22",
  },
  {
    name: "random passerby b",
    email: "rpb@",
    password: hash,
    pic: "Beautiful Small Mushroom-1647238788175.jpg",
    bio: "this is random passerby b's bio sentence.",
    postal: "38",
  },
  {
    name: "random passerby c",
    email: "rpc@",
    password: hash,
    bio: "this is random passerby c's bio sentence.",
    postal: "71",
  },
];

/* 
1. use deleteMany to delete all prev records first b4 seeding 
2. have to use awaits otherwise will jump to closing connx and inserts/queries will fail  
*/
await User.deleteMany({});
await User.insertMany(userSeeds);

//////////////////////////////////////////////////////////////////
/* SEED TASKS */
//////////////////////////////////////////////////////////////////

/* find user ids to link w tasks */
const justus = await User.findOne({ name: "justus" }, "_id").exec();
const gary = await User.findOne({ name: "gary" }, "_id").exec();
const bw = await User.findOne({ name: "bw" }, "_id").exec();
const rpa = await User.findOne({ name: "random passerby a" }, "_id").exec();
const rpb = await User.findOne({ name: "random passerby b" }, "_id").exec();
const rpc = await User.findOne({ name: "random passerby c" }, "_id").exec();

const taskSeeds = [
  {
    description: "justus solo task that is not completed yet",
    taskTag: "Exercises",
    owner: justus._id,
    partner: null,
    partnerAccepted: "false",
    endText: "dun haf",
    financialPenalty: false,
    endApplied: false,
    endIndicated: false,
    completed: false,
    completion: new Date("2022-04-18T05:27:57.092Z"),
  },
  {
    description: "justus solo task that is completed",
    taskTag: "Exercises",
    owner: justus._id,
    partner: null,
    partnerAccepted: "false",
    endText: "really dun haf",
    financialPenalty: false,
    endApplied: false,
    endIndicated: false,
    completed: true,
    completion: new Date("2022-03-15T05:27:57.092Z"),
  },
  {
    description: "justus solo task that is expired",
    taskTag: "Chores",
    owner: justus._id,
    partner: null,
    partnerAccepted: "false",
    endText: "do more chores lor",
    financialPenalty: false,
    endApplied: false,
    endIndicated: false,
    completed: false,
    completion: new Date("2022-03-18T05:27:57.092Z"),
  },
  {
    description: "justus partnered task that is expried",
    taskTag: "Studies",
    owner: justus._id,
    partner: rpa._id,
    partnerAccepted: "true",
    endText: "study even more if fail to complete task",
    financialPenalty: false,
    endApplied: false,
    endIndicated: false,
    completed: false,
    completion: new Date("2022-03-14T05:27:57.092Z"),
  },
  {
    description: "justus pending partner acceptance task",
    taskTag: "Health & Wellness",
    owner: justus._id,
    partner: rpa._id,
    partnerAccepted: "pending",
    endText: "dun haf la, this is alr tough enuff",
    financialPenalty: false,
    endApplied: false,
    endIndicated: false,
    completed: false,
    completion: new Date("2022-04-25T05:27:57.092Z"),
  },
  {
    description: "justus rejected request to be accountability partner task",
    taskTag: "Finance",
    owner: justus._id,
    partner: rpa._id,
    partnerAccepted: "rejected",
    endText: "cannot la, alr $$ not en",
    financialPenalty: false,
    endApplied: false,
    endIndicated: false,
    completed: false,
    completion: new Date("2022-03-30T05:27:57.092Z"),
  },
  {
    description: "justus endIndicated true, waiting for partner to agree task",
    taskTag: "Creativity",
    owner: justus._id,
    partner: rpa._id,
    partnerAccepted: "true",
    endText: "",
    financialPenalty: true,
    endApplied: false,
    endIndicated: true,
    completed: false,
    completion: new Date("2022-03-28T05:27:57.092Z"),
  },
  {
    description: "justus partnered task tt is complete",
    taskTag: "Creativity",
    owner: justus._id,
    partner: rpa._id,
    partnerAccepted: "true",
    endText: "",
    financialPenalty: true,
    endApplied: false,
    endIndicated: true,
    completed: true,
    completion: new Date("2022-03-16T05:27:57.092Z"),
  },
];

/* 
1. use deleteMany to delete all prev records first b4 seeding 
*/
await Task.deleteMany({});
await Task.insertMany(taskSeeds);

/* close the connection otherwise terminal will be left hanging w an open mongodb connection */
console.log("reached end of seed file");
mongoose.connection.close();
