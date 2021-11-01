import mongoose from "mongoose";
const { Schema } = mongoose;

const member = new Schema({
    id: String,
    password: String,
    name: String,
    sex: String,
    birth: Date,
    phone: String,  
});

export default mongoose.model("Member", member);