import mongoose from "mongoose";

const { Schema } = mongoose;

const recordSchema = new Schema({
  id: String,
  time: Number,
  distance: Number,
  steps: Number,
  pace: Number,
  cadence: Number,
  coordinates: {
    type: Array,
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default recordSchema;
