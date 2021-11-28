import Boom from "@hapi/boom";

import { Record, User } from "models";
import * as CommonMd from "../middlewares";

const validateIdMd = async (ctx, next) => {
  const { id } = ctx.state.reqBody;
  const { decoded } = ctx.state.token;
  const user = await User.findOne({ id });
  if (user === null) {
    throw Boom.badRequest("id doesn't exist");
  }
  if (user.friends.filter((item) => item.name === decoded.id).length > 0) {
    throw Boom.badRequest("already friend");
  }
  await next();
};

const getIdFromPathMd = async (ctx, next) => {
  const { id } = ctx.params;
  ctx.state.reqBody = {
    ...ctx.state.reqBody,
    id,
  };
  await next();
};

const getMyRecordMd = async (ctx, next) => {
  const { decoded } = ctx.state.token;
  const myRecord = await Record.find({ id: decoded.id }).select("distance steps time date");
  const myInfo = myRecord.length !== 0
  // eslint-disable-next-line no-param-reassign, no-return-assign
    ? myRecord.reduce((result, item) => result = {
      distance: result.distance + item.distance,
      steps: result.steps + item.steps,
      time: result.time + item.time,
    }) : { distance: 0, steps: 0, time: 0 };
  ctx.state.body = {
    ...ctx.state.body,
    success: true,
    myInfo,
    myRecord,
  };
  await next();
};

const getFriendRecordMd = async (ctx, next) => {
  const { id } = ctx.state.reqBody;
  const friendRecord = await Record.find({ id }).select("distance steps time date");
  const friendInfo = friendRecord.length !== 0
  // eslint-disable-next-line no-param-reassign, no-return-assign
    ? friendRecord.reduce((result, item) => result = {
      distance: result.distance + item.distance,
      steps: result.steps + item.steps,
      time: result.time + item.time,
    }) : { distance: 0, steps: 0, time: 0 };
  ctx.state.body = {
    ...ctx.state.body,
    friendInfo,
    friendRecord,
  };
  await next();
};

export const readById = [
  CommonMd.getTokenMd,
  getIdFromPathMd,
  validateIdMd,
  getMyRecordMd,
  getFriendRecordMd,
  CommonMd.responseMd,
];
