import BaseController from "./baseCtrl.mjs";
import { resolve } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";

export default class UserController extends BaseController {
  constructor(model, salt) {
    super(model, salt);
  }

  async getProfile(req, res) {
    const email = "justus@passerby.com";
    try {
      const profile = await this.model.findOne({ email });
      console.log(profile);
      if (profile) {
        res.send(profile);
      }
    } catch (err) {
      this.errorHandler(err, res);
    }
  }

  async updateProfilePic(req, res) {
    const { id } = req.body;

    try {
      const currentUser = await this.model.findOne({ _id: id });
      currentUser.pic = req.file.originalname;
      await currentUser.save();
      res.send(currentUser.pic);
    } catch (err) {
      const msg = "Something went wrong with the upload, pls login and try again";
      this.errorHandler(err, msg, res);
    }
  }
}
