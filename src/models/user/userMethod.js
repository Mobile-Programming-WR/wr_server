import userSchema from "./userSchema";
import crypto from "crypto";

const hash = (password) => {
    return crypto.createHmac("sha256", process.env.SECRET_KEY).update(password).digest("hex");
};

userSchema.pre("save", function (next)  {
  this.password = hash(this.password);
  next();
});
