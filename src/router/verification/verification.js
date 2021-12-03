import Boom from "@hapi/boom";
import Cache from "memory-cache";
import axios from "axios";
import CryptoJS from "crypto-js";
import * as CommonMd from "../middlewares";
// import { User } from "models";

const getDataFromBodyMd = async (ctx, next) => {
  const { phone, verifyCode } = ctx.request.body;
  ctx.state.reqBody = { phone, verifyCode };

  await next();
};

const generateVerifyMd = async (ctx, next) => {
  const { phone } = ctx.state.reqBody;
  let verifyCode = "";
  for (let i = 0; i < 6; i += 1) {
    const rand = parseInt(Math.random() * 10, 10);
    verifyCode += String(rand);
  }
  try {
    Cache.del(phone);
    Cache.put(phone, verifyCode);
  } catch (e) {
    throw Boom.badRequest(e);
  }

  ctx.state.reqBody = {
    ...ctx.state.reqBody,
    verifyCode,
  };

  await next();
};

export const sendSmsMd = async (ctx, next) => {
  const { phone, verifyCode } = ctx.state.reqBody;
  const sens = {
    serviceId: process.env.SENS_ID,
    secretKey: process.env.SENS_SECRET,
    accessKey: process.env.SENS_ACCESS_KEY,
    number: process.env.SENS_NUMBER,
  };

  const timeStamp = Date.now().toString();
  // const uri = sens.serviceId;
  const { secretKey, accessKey } = sens;
  const method = "POST";
  const space = " ";
  const newLine = "\n";
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${sens.serviceId}/messages`;
  const url2 = `/sms/v2/services/${sens.serviceId}/messages`;

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(timeStamp);
  hmac.update(newLine);
  hmac.update(accessKey);

  const hash = hmac.finalize();
  const signature = hash.toString(CryptoJS.enc.Base64);

  const body = {
    "type": "SMS",
    "from": sens.number.toString(),
    "content": `[인증번호] ${verifyCode}`.toString(),
    "messages": [{
      "to": phone.toString(),
      "content": `[인증번호] ${verifyCode}`.toString(),
    }],
  };

  const headers = {
    "Content-type": "application/json;",
    "x-ncp-iam-access-key": accessKey,
    "x-ncp-apigw-timestamp": timeStamp,
    "x-ncp-apigw-signature-v2": signature,
  };
  const res = await axios.post(url, body, { headers });

  if (res.data.error) {
    throw Boom.badRequest(res.data.error);
  }

  ctx.state.body = { success: true };
  await next();
};

const confirmVerifyCodeMd = async (ctx, next) => {
  const { phone, verifyCode } = ctx.state.reqBody;
  if (Cache.get(phone).toString() !== verifyCode.toString()) {
    throw Boom.badRequest("worng verifyCode");
  }

  ctx.state.body = {
    success: true,
  };
  await next();
};

export const postVerifySms = [
  getDataFromBodyMd,
  generateVerifyMd,
  sendSmsMd,
  CommonMd.responseMd,
];

export const confirmVerifySms = [
  getDataFromBodyMd,
  confirmVerifyCodeMd,
  CommonMd.responseMd,
];
