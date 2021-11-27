import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  id: String,
  password: String,
  name: String,
  sex: String,
  birth: Date,
  phone: String,
  friends: {
    type: Array,
    default: [],
  },
  addRequest: {
    type: Array,
    default: [],
  },
  competitionRequest: {
    type: Array,
    default: [],
  },
});

export default userSchema;
