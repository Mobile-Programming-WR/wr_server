import { Boom } from "@hapi/boom";
import jwt from "jsonwebtoken";

const generateJwtMd = async (ctx, next) => {
  const { payload, exp } = ctx.state.payload;
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: exp });
    ctx.state.body = { token };
  } catch (e) {
    throw Boom.badRequest(e);
  }
  await next();
};

export default generateJwtMd;
