import Boom from "@hapi/boom";
import crypto from "crypto";
import { User } from "models";
import * as CommonMd from "../middlewares";

export const getDataFromBodyMd = async (ctx, next) => {
  /* eslint-disable no-alert, object-curly-newline */
  const { id, password, name, sex, birth, phone } = ctx.request.body;
  ctx.state.reqBody = {
    id,
    password,
    name,
    sex,
    birth,
    phone,
  };
  await next();
};

export const validateDataMd = async (ctx, next) => {
  const { id, password, name, sex, birth, phone } = ctx.state.reqBody;

  if (!id || !password || !name || !sex || !birth || !phone) {
    throw Boom.badRequest("field is not fulfiled");
  }

  await next();
};

export const isDuplicatedMd = async (ctx, next) => {
  const { id, phone } = ctx.state.reqBody;

  const usersById = await User.findOne({ id }).exec();
  const usersByPhone = await User.findOne({ phone }).exec();
  if (usersById || usersByPhone) {
    throw Boom.badRequest("duplicated info");
  }
  await next();
};

export const saveUserMd = async (ctx, next) => {
  const { id, password, name, sex, birth, phone } = ctx.state.reqBody;
  const user = new User({
    id,
    password,
    name,
    sex,
    birth,
    phone,
  });

  await user.save();

  ctx.state.body = { success: true };

  await next();
};

export const comparePasswordMd = async (ctx, next) => {
  const { id, password } = ctx.state.reqBody;
  const user = await User.findOne({ id }).exec();

  if (user === null) {
    throw Boom.badRequest("invalid id");
  }
  const hashed = await crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(password)
    .digest("hex");
  console.log(hashed);
  if (hashed !== user.password) {
    throw Boom.badRequest("wrong password");
  }

  const payload = {
    // eslint-disable-next-line no-underscore-dangle
    id: user.id,
    name: user.name,
  };
  ctx.state.payload = {
    payload,
    exp: "14d",
  };
  ctx.state.body = {
    ...ctx.state.body,
    name: user.name,
  };
  await next();
};

const validateTokenMd = async (ctx, next) => {
  const { id, name } = ctx.state.reqBody;
  const user = await User.findOne({ id, name });
  if (!user) {
    Boom.badRequest("Invalid Token");
  }
  ctx.state.body = {
    ...ctx.state.body,
    success: true,
  };

  await next();
};

const changePasswordMd = async (ctx, next) => {
  const { id, password } = ctx.state.reqBody;
  await User.findOneAndUpdate({ id }, { $set: { password } }).exec();
  ctx.state.body = { success: true };
  await next();
};

export const create = [
  getDataFromBodyMd,
  validateDataMd,
  isDuplicatedMd,
  saveUserMd,
  CommonMd.responseMd,
];

export const login = [
  getDataFromBodyMd,
  comparePasswordMd,
  CommonMd.generateJwtMd,
  CommonMd.responseMd,
];

export const changePw = [
  getDataFromBodyMd,
  CommonMd.getTokenMd,
  validateTokenMd,
  changePasswordMd,
  CommonMd.responseMd,
];

export const verification = [
  CommonMd.getTokenMd,
  validateTokenMd,
  CommonMd.generateJwtMd,
  CommonMd.responseMd,
];
