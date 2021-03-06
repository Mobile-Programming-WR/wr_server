/* eslint-disable consistent-return */
import Boom from "@hapi/boom";
import { User } from "models";
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
  const user = await User.findOne({ id });
  await User.findOneAndUpdate(
    { id: decoded.id },
    {
      $pull: { addRequest: { id } },
      $push: { friends: { id: user.id, name: user.name } },
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
  await User.findOneAndUpdate({ id: decoded.id }, {
    $pull: { friends: { id }, addRequest: { id }, competition: { id } },
  }).exec();
  await User.findOneAndUpdate({ id }, {
    // eslint-disable-next-line max-len
    $pull: { friends: { id: decoded.id }, addRequest: { id: decoded.id }, competition: { id: decoded.id } },
  }).exec();
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

const sendAddCompetitionMd = async (ctx, next) => {
  const { id } = ctx.state.reqBody;
  const { decoded } = ctx.state.token;
  const friend = {
    id: decoded.id,
    name: decoded.name,
  };
  await User.findOneAndUpdate({ id }, { $push: { competitionRequest: friend } });
  ctx.state.body = {
    success: true,
  };
  await next();
};

const checkBeforeAddMd = async (ctx, next) => {
  // ?????? ???????????? ??????
  const { id } = ctx.state.reqBody;
  const { decoded } = ctx.state.token;
  const user = await User.findOne({ id });
  const checkFriend = (element) => {
    if (element.id === decoded.id && element.name === decoded.name) {
      return true;
    }
  };
  if (user.friends.some(checkFriend)) {
    throw Boom.badRequest("Already friend");
  }
  // ?????? ??????????????? ??????
  if (user.addRequest.some(checkFriend)) {
    throw Boom.badRequest("Already sended");
  }
  await next();
};

const checkBeforeAcceptMd = async (ctx, next) => {
  const { id } = ctx.state.reqBody;
  const { decoded } = ctx.state.token;
  const user = await User.findOne({ id });
  // ?????? ???????????? ??????
  const checkFriend = (element) => {
    if (element.id === decoded.id && element.name === decoded.name) {
      return true;
    }
  };
  if (user.friends.some(checkFriend)) {
    throw Boom.badRequest("Already friend");
  }
  await next();
};

const checkBeforeRemove = async (ctx, next) => {
  const { id } = ctx.state.reqBody;
  const { decoded } = ctx.state.token;
  const user = await User.findOne({ id });
  // ???????????? ??????
  const checkFriend = (element) => {
    if (element.id === decoded.id && element.name === decoded.name) {
      return true;
    }
  };
  if (!user.friends.some(checkFriend)) {
    throw Boom.badRequest("no friend");
  }
  await next();
};

const checkBeforeAddCompetitionMd = async (ctx, next) => {
  const { id } = ctx.state.reqBody;
  const { decoded } = ctx.state.token;
  const user = await User.findOne({ id });
  // ???????????? ??????
  // eslint-disable-next-line consistent-return
  const checkFriend = (element) => {
    if (element.id === decoded.id && element.name === decoded.name) {
      return true;
    }
  };
  if (!user.friends.some(checkFriend)) {
    throw Boom.badRequest("not friend");
  }
  // ?????? ??????????????? ??????
  if (user.competition.some(checkFriend)) {
    throw Boom.badRequest("Already in competition");
  }
  // ?????? ??????????????? ??????
  if (user.competitionRequest.some(checkFriend)) {
    throw Boom.badRequest("Already sended");
  }
  await next();
};

const checkBeforeAcceptCompetitionMd = async (ctx, next) => {
  const { id } = ctx.state.reqBody;
  const { decoded } = ctx.state.token;
  const user = await User.findOne({ id });
  // ?????? ??????????????? ??????
  const checkFriend = (element) => {
    if (element.id === decoded.id && element.name === decoded.name) {
      return true;
    }
  };
  if (user.competition.some(checkFriend)) {
    throw Boom.badRequest("Already in competition");
  }
  await next();
};

const acceptCompetitionMd = async (ctx, next) => {
  const { id } = ctx.state.reqBody;
  const { decoded } = ctx.state.token;
  const user = await User.findOne({ id });
  await User.findOneAndUpdate(
    { id: decoded.id },
    {
      $pull: { competitionRequest: { id } },
      $push: { competition: { id: user.id, name: user.name } },
    },
  ).exec();
  const friend = { id: decoded.id, name: decoded.name };
  await User.findOneAndUpdate({ id }, { $push: { competition: friend } }).exec();
  ctx.state.body = { success: true };
  await next();
};

const readCompetitionRequestMd = async (ctx, next) => {
  const { decoded } = ctx.state.token;
  const user = await User.findOne({ id: decoded.id });
  ctx.state.body = {
    success: true,
    results: user.competitionRequest,
  };
  await next();
};

const readCompetitionMd = async (ctx, next) => {
  const { decoded } = ctx.state.token;
  const user = await User.findOne({ id: decoded.id });
  ctx.state.body = {
    success: true,
    results: user.competition,
  };
  await next();
};

export const add = [
  CommonMd.getTokenMd,
  getIdFromPathMd,
  validateIdMd,
  checkBeforeAddMd,
  sendAddRequestMd,
  CommonMd.responseMd,
];

export const accept = [
  CommonMd.getTokenMd,
  getIdFromPathMd,
  validateIdMd,
  checkBeforeAcceptMd,
  acceptRequestMd,
  CommonMd.responseMd,
];

export const remove = [
  CommonMd.getTokenMd,
  getIdFromPathMd,
  validateIdMd,
  checkBeforeRemove,
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

export const addCompetition = [
  CommonMd.getTokenMd,
  getIdFromPathMd,
  validateIdMd,
  checkBeforeAddCompetitionMd,
  sendAddCompetitionMd,
  CommonMd.responseMd,
];

export const acceptCompetition = [
  CommonMd.getTokenMd,
  getIdFromPathMd,
  validateIdMd,
  checkBeforeAcceptCompetitionMd,
  acceptCompetitionMd,
  CommonMd.responseMd,
];

export const readCompetitionRequest = [
  CommonMd.getTokenMd,
  readCompetitionRequestMd,
  CommonMd.responseMd,
];

export const readCompetition = [
  CommonMd.getTokenMd,
  readCompetitionMd,
  CommonMd.responseMd,
];
