import { Boom } from "@hapi/boom";
import { Record } from "models";
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
  const record = new Record({
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
  ctx.state.body = {
    success: true,
    result: record,
  };
  await next();
};

export const create = [
  CommonMd.getTokenMd,
  getDataFromBodyMd,
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
