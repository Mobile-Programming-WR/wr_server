import Boom from "@hapi/boom";
import jwt from "jsonwebtoken";

export const decodeToken = (token) => {
  const decodedToken = new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
  return decodedToken;
};

const getTokenMd = async (ctx, next) => {
  const accessToken = ctx.headers.authorization.split(" ")[1];
  if (!accessToken) Boom.badRequest("invalid token");
  const decoded = await decodeToken(accessToken);
  if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24 * 14) {
    throw Boom.badRequest("timeout");
  }
  ctx.state.token = {
    decoded,
  };

  await next();
};

export default getTokenMd;
