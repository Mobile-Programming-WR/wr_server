import { Boom } from "@hapi/boom";
import { Record } from "models";
import { User } from "../../models";
import * as CommonMd from "../middlewares";

const getDataFromBodyMd = async (ctx, next) => {
  const {
    time,
    distance,
    steps,
    pace,
    cadence,
    coordinates,
  } = ctx.request.body;
  ctx.state.reqBody = {
    time,
    distance,
    steps,
    pace,
    cadence,
    coordinates,
  };
  await next();
};

const saveRecordMd = async (ctx, next) => {
  const { decoded } = ctx.state.token;
  const {
    time,
    distance,
    steps,
    pace,
    cadence,
    coordinates,
  } = ctx.state.reqBody;
  const record = await new Record({
    id: decoded.id,
    time,
    distance,
    steps,
    pace,
    cadence,
    coordinates,
  });
  await record.save();
  ctx.state.body = {
    success: true,
  };
  await next();
};

const readMyRecordsMd = async (ctx, next) => {
  const { decoded } = ctx.state.token;

  const rows = await Record.find({ id: decoded.id }).exec();
  ctx.state.body = {
    success: true,
    results: rows,
  };
  await next();
};

const getUidByPathMd = async (ctx, next) => {
  const { uid } = ctx.params;
  ctx.state.reqBody = {
    ...ctx.state.reqBody,
    uid,
  };
  await next();
};

const readRecordByUid = async (ctx, next) => {
  const { uid } = ctx.state.reqBody;
  const { id } = ctx.state.token.decoded;
  const record = await Record.findOne({ _id: uid, id }).exec();
  if (!record) {
    throw Boom.badRequest("Invalid uid");
  }
  ctx.state.body = {
    success: true,
    result: record,
  };
  await next();
};

const updateUserDistanceMd = async (ctx, next) => {
  const { id } = ctx.state.token.decoded;
  const { distance } = ctx.state.reqBody;
  const user = await User.findOne({ id });
  console.log(user.distance);
  await User.findOneAndUpdate({ id },
    {
      $set: {
        distance: Number(user.distance) + Number(distance),
      },
    }).exec();
  await next();
};

export const create = [
  CommonMd.getTokenMd,
  getDataFromBodyMd,
  updateUserDistanceMd,
  saveRecordMd,
  CommonMd.responseMd,
];

export const readMy = [
  CommonMd.getTokenMd,
  readMyRecordsMd,
  CommonMd.responseMd,
];

export const readByUid = [
  CommonMd.getTokenMd,
  getUidByPathMd,
  readRecordByUid,
  CommonMd.responseMd,
];
