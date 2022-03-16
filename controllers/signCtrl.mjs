import BaseController from "./baseCtrl.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
/* testing comment to make sure upating main will not cause changes in bw_copy */

export default class HomeController extends BaseController {
  constructor(model, salt) {
    super(model, salt);
  }

  async doLogIn(req, res) {
    const { email, password } = req.body;
    try {
      const user = await this.model.findOne({ email });
      if (!user) {
        throw Error;
      } else {
        const logInSuccess = await bcrypt.compare(password, user.password);
        if (!logInSuccess) {
          throw Error;
        }
        const token = jwt.sign({}, this.salt, { expiresIn: "6h" });
        const result = {
          id: user._id,
          token,
        };
        res.send(result);
      }
    } catch (err) {
      const msg = "Either email does not exist or password is incorrect";
      this.errorHandler(err, msg, res);
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
        throw Error;
      } else {
        const token = jwt.sign({}, this.salt, { expiresIn: "6h" });
        const result = {
          id: newUser._id,
          token,
        };
        res.send(result);
      }
    } catch (err) {
      let msg;
      if (err.code == 11000) {
        msg = "Email already in use, pls try again";
      } else {
        msg = "Something went wrong with the sign-up, pls try again later";
      }
      this.errorHandler(err, msg, res);
    }
  }
}

/* there is no doLogOut required since logging out is simply resetting store state at frontend. so no need for back end work here */
