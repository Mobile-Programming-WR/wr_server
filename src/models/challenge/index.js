import mongoose from "mongoose";

import challengeSchema from "./challengeSchema";

export default mongoose.model("Challenge", challengeSchema);
