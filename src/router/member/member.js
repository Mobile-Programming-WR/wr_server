import Boom from "@hapi/boom";
import Member from "../../models/member";
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

  let members;

  members = await Member.findOne({id, phone}).exec();
  if(members){
      throw Boom.badRequest("duplicated info");
  }
  await next();
};

export const saveMemberMd = async (ctx, next) => {
  const { id, password, name, sex, birth, phone } = ctx.state.reqBody;
  const member = new Member({
    id,
    password,
    name,
    sex,
    birth,
    phone
  });

  await member.save();

  ctx.body = member;

  await next();
};

export const create = [
  getDataFromBodyMd,
  validateDataMd,
  isDuplicatedMd,
  saveMemberMd,
  CommonMd.responseMd,
];