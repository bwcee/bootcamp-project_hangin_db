import BaseController from "./baseCtrl.mjs";
import fs from "fs";
/* __dirname used for deleting old profile pics below. instead of redefining it, just import from index.mjs */
import { __dirname } from "./../index.mjs";

export default class UserController extends BaseController {
  constructor(model, salt) {
    super(model, salt);
  }

  async getUser(req, res) {
    const { id } = req.params;
    try {
      const user = await this.model
        .findById(id, "_id name email pic bio postal requests")
        .exec();
      console.log("why no email?", user);
      res.send(user);
    } catch (err) {
      let msg = "";
      this.errorHandler(err, msg, res);
    }
  }

  async getAllUsers(req, res) {
    const { id } = req.params;
    try {
      const allUsers = await this.model
        .find({ _id: { $ne: id } }, "_id name pic bio postal")
        .exec();
      res.send(allUsers);
    } catch (err) {
      let msg = "";
      this.errorHandler(err, msg, res);
    }
  }

  async addRequest(req, res) {
    const { userId, taskId } = req.body;
    try {
      const user = await this.model.findById(userId);
      user.requests.push(taskId);
      user.save();
      console.log(user);
    } catch (err) {
      let msg = "";
      this.errorHandler(err, msg, res);
    }
  }

  async updateProfilePic(req, res) {
    const { id } = req.body;
    try {
      const currentUser = await this.model.findOne({ _id: id });
      const oldPic = currentUser.pic;
      /* delete old profile pic if exists */
      if (oldPic) {
        fs.unlink(`${__dirname}/public/pics/${oldPic}`, (err) => {
          if (err) console.log(err);
        });
      }
      currentUser.pic = req.file.originalname;
      await currentUser.save();
      res.send(currentUser.pic);
    } catch (err) {
      const msg =
        "Something went wrong with the upload, pls login and try again";
      this.errorHandler(err, msg, res);
    }
  }

  async updateName(req, res) {
    const { id, name } = req.body;

    try {
      const currentUser = await this.model.findOneAndUpdate(
        { _id: id },
        { name: name },
        { new: true }
      );
      res.send(currentUser);
    } catch (err) {
      const msg =
        "Something went wrong with the update, pls login and try again";
      this.errorHandler(err, msg, res);
    }
  }

  async updateEmail(req, res) {
    const { id, email } = req.body;

    try {
      const currentUser = await this.model.findOneAndUpdate(
        { _id: id },
        { email: email },
        { new: true }
      );
      res.send(currentUser);
    } catch (err) {
      const msg =
        "Something went wrong with the update, pls login and try again";
      this.errorHandler(err, msg, res);
    }
  }

  async updateBio(req, res) {
    const { id, bio } = req.body;

    try {
      const currentUser = await this.model.findOneAndUpdate(
        { _id: id },
        { bio: bio },
        { new: true }
      );
      res.send(currentUser);
    } catch (err) {
      const msg =
        "Something went wrong with the update, pls login and try again";
      this.errorHandler(err, msg, res);
    }
  }

  async updatePostal(req, res) {
    const { id, postal } = req.body;

    try {
      const currentUser = await this.model.findOneAndUpdate(
        { _id: id },
        { postal: postal },
        { new: true }
      );
      res.send(currentUser);
    } catch (err) {
      const msg =
        "Something went wrong with the update, pls login and try again";
      this.errorHandler(err, msg, res);
    }
  }
}
