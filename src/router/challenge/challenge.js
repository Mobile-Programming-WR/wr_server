import { User, Challenge } from "models";
import * as CommonMd from "../middlewares";

const getRankMd = async (ctx, next) => {
  const { id } = ctx.state.token.decoded;
  const users = await User.find()
    .sort({ distance: -1 });
  const rank = users.findIndex((item) => item.id === id) / users.length;
  ctx.state.body = {
    ...ctx.state.body,
    rank,
  };

  await next();
};

const getChallengeMd = async (ctx, next) => {
  const challenge = await Challenge.findOne().sort({ date: -1 });
  ctx.state.body = {
    ...ctx.state.body,
    recordsList: challenge.ranker,
    success: true,
  };
  await next();
};

export const read = [
  CommonMd.getTokenMd,
  getRankMd,
  getChallengeMd,
  CommonMd.responseMd,
];
