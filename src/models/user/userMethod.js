import crypto from "crypto";
import userSchema from "./userSchema";

const hash = (password) => {
  const hashed = crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(password)
    .digest("hex");
  return hashed;
};

userSchema.pre("save", function (next) {
  this.password = hash(this.password);
  next();
});
