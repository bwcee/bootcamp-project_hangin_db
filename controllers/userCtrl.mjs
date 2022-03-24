import BaseController from "./baseCtrl.mjs";
import fs from "fs";
/* __dirname used for deleting old profile pics below. instead of redefining it, just import from index.mjs */
import { __dirname } from "./../index.mjs";
import bcrypt from "bcrypt";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default class UserController extends BaseController {
  constructor(model, salt) {
    super(model, salt);
  }

  async getUser(req, res) {
    const { id } = req.params;
    try {
      const user = await this.model
        .findById(id, "_id name email pic bio postal requests payment")
        .exec();
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

  async updatePassword(req, res) {
    const { id, currentPswd, newPswd, confirmPswd } = req.body;

    try {
      const currentUser = await this.model.findOne({ _id: id });

      if (!currentUser) {
        res.status(404).send("No such user.");
        throw Error;
      }

      const isCorrectPswd = await bcrypt.compare(
        currentPswd,
        currentUser.password
      );

      console.log(isCorrectPswd);

      if (!isCorrectPswd) {
        res.status(403).send("Incorrect password.");
        throw Error;
      }

      if (newPswd !== confirmPswd) {
        res.status(400).send("Password not confirmed.");
        throw Error;
      }

      const hashedPswd = await bcrypt.hashSync(newPswd, 8);
      currentUser.password = hashedPswd;
      await currentUser.save();
      res.status(200).send("Password updated.");
    } catch (err) {
      const msg =
        "Something went wrong with the update, pls login and try again";
      this.errorHandler(err, msg, res);
    }
  }

  async getClientSecret(req, res) {
    const { customerId } = req.body;

    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ["card"],
      });

      res.json({ client_secret: setupIntent.client_secret });
    } catch (err) {
      const msg =
        "Something went wrong with the update, pls login and try again";
      this.errorHandler(err, msg, res);
    }
  }

  async getPaymentSecret(req, res) {
    const { customerId, methodId, centsAmount } = req.body;
    console.log("back rcvd ", customerId, methodId, centsAmount);

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: centsAmount,
        currency: "sgd",
        customer: customerId,
        payment_method: methodId,
        payment_method_types: ["card"],
        confirm: true,
      });

      res.json({ client_secret: paymentIntent.client_secret });
    } catch (err) {
      // Error code will be authentication_required if authentication is needed
      console.log("Error code is: ", err.code);
      const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
        err.raw.payment_intent.id
      );
      console.log("PI retrieved: ", paymentIntentRetrieved.id);
    }
  }

  async getPaymentMethod(req, res) {
    const { customerId } = req.body;
    console.log(customerId);

    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });

      res.json({ paymentMethods: paymentMethods.data });
    } catch (err) {
      const msg =
        "Something went wrong with the update, pls login and try again";
      this.errorHandler(err, msg, res);
    }
  }
}
