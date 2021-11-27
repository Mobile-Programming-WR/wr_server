import mongoose from "mongoose";

const { Schema } = mongoose;

const challengeSchema = new Schema({
  ranker: {
    type: Array,
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default challengeSchema;
