import mongoose from "mongoose";
import userSchema from "./userSchema";
import "./userMethod";

export default mongoose.model("User", userSchema);
