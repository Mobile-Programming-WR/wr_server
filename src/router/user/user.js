import Boom from "@hapi/boom";
import crypto from "crypto";
import { User } from "models";
import * as CommonMd from "../middlewares";

export const getDataFromBodyMd = async (ctx, next) => {
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

  if(!id || !password || !name || !sex || !birth || !phone) {
    throw Boom.badRequest("field is not fulfiled");
  }

  await next();
};

export const isDuplicatedMd = async (ctx, next) => {
  const { id, phone } = ctx.state.reqBody;

  let users;

  users = await User.findOne({id, phone}).exec();
  if(users){
      throw Boom.badRequest("duplicated info");
  }
  await next();
};

export const saveUserMd = async (ctx, next) => {
  const { id, password, name, sex, birth, phone } = ctx.state.reqBody;
  const user = new user({
    id,
    password,
    name,
    sex,
    birth,
    phone
  });

  await user.save();

  ctx.body = user;

  await next();
};

export const comparePasswordMd = async (ctx, next) => {
  const { id, password } = ctx.state.reqBody;
  const hash = (password) => {
    return crypto.createHmac("sha256", process.env.SECRET_KEY).update(password).digest("hex");
  };
  const user = User.findOne({id}).exec();
  if(hash(password)!==user.password);

  const payload = {
    id: user.id,
    name: user.name,
  };
  ctx.state.payload = {
    payload,
    exp: "14d",
  };
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