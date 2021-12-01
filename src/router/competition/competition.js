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
  const records = await Record.find({ id: decoded.id }).select("distance steps time date");

  const myRecord = [];
  // 오늘부터 10일 전까지 더하기
  for (let i = 0; i < 10; i += 1) {
    const d = new Date();
    const dayOfMonth = d.getDate();
    d.setDate(dayOfMonth - i);
    const sum = records.filter((item) => item.date.getDate() === d.getDate()).length !== 0
      ? records.filter((item) => item.date.getDate() === d.getDate())
      // eslint-disable-next-line no-param-reassign, no-return-assign
        .reduce((result, item) => result = {
          distance: result.distance + item.distance,
          steps: result.steps + item.steps,
          time: result.time + item.time,
        }) : { distance: 0, steps: 0, time: 0 };
    sum.date = d;
    myRecord[i] = sum;
  }
  // eslint-disable-next-line no-param-reassign, no-return-assign
  const myInfo = myRecord.reduce((result, item) => result = {
    distance: result.distance + item.distance,
    steps: result.steps + item.steps,
    time: result.time + item.time,
  });
  const user = await User.findOne({ id: decoded.id });
  myInfo.name = user.name;
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
  const records = await Record.find({ id }).select("distance steps time date");

  const friendRecord = [];
  for (let i = 0; i < 10; i += 1) {
    const d = new Date();
    const dayOfMonth = d.getDate();
    d.setDate(dayOfMonth - i);
    const sum = records.filter((item) => item.date.getDate() === d.getDate()).length !== 0
      ? records.filter((item) => item.date.getDate() === d.getDate())
      // eslint-disable-next-line no-param-reassign, no-return-assign
        .reduce((result, item) => result = {
          distance: result.distance + item.distance,
          steps: result.steps + item.steps,
          time: result.time + item.time,
        }) : { distance: 0, steps: 0, time: 0 };
    sum.date = d;
    friendRecord[i] = sum;
  }
  // eslint-disable-next-line no-param-reassign, no-return-assign
  const friendInfo = friendRecord.reduce((result, item) => result = {
    distance: result.distance + item.distance,
    steps: result.steps + item.steps,
    time: result.time + item.time,
  });
  const user = await User.findOne({ id });
  friendInfo.name = user.name;
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
