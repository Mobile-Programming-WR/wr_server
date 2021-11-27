import cron from "node-cron";

import { User, Challenge } from "models";

const refreshChallenge = async () => {
  const rows = await User.find().sort({ distance: -1 }).limit(10).exec();
  const challenge = await new Challenge({
    ranker: rows,
  });
  await challenge.save();
};

const scheduler = () => {
  cron.schedule("0 0-23 * * *", refreshChallenge);
};

export default scheduler;
