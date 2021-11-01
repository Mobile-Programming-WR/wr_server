import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  id: String,
  password: String,
  name: String,
  sex: String,
  birth: Date,
  phone: String,
});

export default userSchema;
