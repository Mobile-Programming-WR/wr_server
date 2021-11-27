import mongoose from "mongoose";

import recordSchema from "./recordSchema";

export default mongoose.model("Record", recordSchema);
