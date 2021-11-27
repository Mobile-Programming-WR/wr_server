import mongoose from "mongoose";

const { Schema } = mongoose;

const recordSchema = new Schema({
  id: String,
  time: String,
  distance: String,
  steps: String,
  pace: String,
  cadence: String,
  coordinates: {
    type: Array,
    default: [],
  },
});

export default recordSchema;
