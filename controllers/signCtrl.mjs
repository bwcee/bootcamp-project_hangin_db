import BaseController from "./baseCtrl.mjs";
import { resolve } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class HomeController extends BaseController {
  constructor(model, salt) {
    super(model, salt);
  }


  async doLogIn(req, res) {
    const { email, password } = req.body;
    try {
      const user = await this.model.findOne({ email });
      if (!user) {
        res.send("null");
      } else {
        const logInSuccess = await bcrypt.compare(password, user.password);

        if (logInSuccess) {
          const payload = {
            _id: user._id,
            name: user.name,
          };
          const token = jwt.sign(payload, this.salt, { expiresIn: "6h" });
          res.send(token);
        } else {
          res.send("null");
        }
      }
    } catch (err) {
      this.errorHandler(err, res);
    }
  }

  async doSignUp(req, res) {
    const { name, email, password, postal } = req.body;
    try {
      const hashedPass = bcrypt.hashSync(password, 8);
      
      const newUser = await this.model.create({
        name,
        email,
        password: hashedPass,
        postal,
      });
      /* can't think of a situation where newUser wld be null... but oh well... guess additional chk doesn't hurt */
      if (!newUser) {
        res.send("null");
      } else {
        const payload = {
          _id: newUser._id,
          name: newUser.name,
        };
        const token = jwt.sign(payload, this.salt, { expiresIn: "6h" });
        res.send(token);
      }
    } catch (err) {
      this.errorHandler(err, res);
    }
  }
}

/* there is no doLogOut required since logging out is simply removing token from local storage. so logging out done completely in front end at src/login.jsx wo any need for back end work here */
