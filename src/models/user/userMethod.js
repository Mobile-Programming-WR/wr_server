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

userSchema.pre("findOneAndUpdate", function (next) {
  // eslint-disable no-alert, no-underscore-dangle
  // const newPw = hash(this._update.password);
  // this._update.password = newPw;
  // // this.set({ password: newPw });
  // console.log(newPw);
  // console.log(this);
  next();
});
