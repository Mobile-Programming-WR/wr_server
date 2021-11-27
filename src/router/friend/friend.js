import Boom, { badRequest } from "@hapi/boom";
import { User } from "models";
import * as CommonMd from "../middlewares";

// const getDataFromBodyMd = async (ctx, next) => {
//   const { id } = ctx.request.body;
//   ctx.state.reqBody = { id };
//   await next();
// };

const validateIdMd = async (ctx, next) => {
  const { id } = ctx.state.reqBody;
  const user = await User.findOne({ id });
  if (user === null) {
    throw Boom.badRequest("invalid id");
  }
  await next();
};

const sendAddRequestMd = async (ctx, next) => {
  const { id } = ctx.state.reqBody;
  const { decoded } = ctx.state.token;
  const friend = {
    id: decoded.id,
    name: decoded.name,
  };
  User.findOneAndUpdate({ id }, { $push: { addRequest: friend } }).exec();
  ctx.state.body = {
    success: true,
  };
  await next();
};

const acceptRequestMd = async (ctx, next) => {
  const { id } = ctx.state.reqBody;
  const { decoded } = ctx.state.token;
  const user = await User.findOne({ id: decoded.id, name: decoded.name });
  const addRequest = user.addRequest.find((x) => x.id === id);
  if (addRequest === undefined) {
    throw badRequest("no add request");
  }
  await User.findOneAndUpdate(
    { id: decoded.id },
    {
      $pull: { addRequest: { id: addRequest.id } },
      $push: { friends: addRequest },
    },
  ).exec();
  const friend = { id: decoded.id, name: decoded.name };
  await User.findOneAndUpdate({ id }, { $push: { friends: friend } }).exec();
  ctx.state.body = { success: true };
  await next();
};

const removeFriendMd = async (ctx, next) => {
  const { id } = ctx.state.reqBody;
  const { decoded } = ctx.state.token;
  await User.findOneAndUpdate({ id: decoded.id }, { $pull: { friends: { id } } });
  await User.findOneAndUpdate({ id }, { $pull: { friends: { id: decoded.id } } });
  ctx.state.body = { success: true };
  await next();
};

const getFriendsListMd = async (ctx, next) => {
  const { decoded } = ctx.state.token;
  const user = await User.findOne({ id: decoded.id });
  ctx.state.body = {
    success: true,
    results: user.friends,
  };
  await next();
};

const getRequestListMd = async (ctx, next) => {
  const { decoded } = ctx.state.token;
  const user = await User.findOne({ id: decoded.id });
  ctx.state.body = {
    success: true,
    results: user.addRequest,
  };
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

export const add = [
  CommonMd.getTokenMd,
  getIdFromPathMd,
  validateIdMd,
  sendAddRequestMd,
  CommonMd.responseMd,
];

export const accept = [
  CommonMd.getTokenMd,
  getIdFromPathMd,
  validateIdMd,
  acceptRequestMd,
  CommonMd.responseMd,
];

export const remove = [
  CommonMd.getTokenMd,
  getIdFromPathMd,
  validateIdMd,
  removeFriendMd,
  CommonMd.responseMd,
];

export const readFriends = [
  CommonMd.getTokenMd,
  getFriendsListMd,
  CommonMd.responseMd,
];

export const readRequest = [
  CommonMd.getTokenMd,
  getRequestListMd,
  CommonMd.responseMd,
];
