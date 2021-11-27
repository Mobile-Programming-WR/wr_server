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
