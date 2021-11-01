import Koa from "koa";
import bodyParser from "koa-bodyparser";
// import mariadb from "mariadb";
import cors from "koa-cors";
// import path from "path";
// import Config from "./config";
// import Server from "socket.io";
import { createServer } from "http";
import mongoose from "mongoose";
import Dotenv from "dotenv";
import Router from "./router";
import { errorHandleMd } from "./middlewares";

Dotenv.config();
const app = new Koa();
const server = createServer(app.callback());
const db = async () => {
  const res = await mongoose.connect(process.env.MONGO_URI);

  if (res) {
    /* eslint-disable no-alert, no-console */
    console.log("Successfully connected to mongodb");
  } else {
    console.log("Mongodb Connection fault");
  }
};
const main = async () => {
  try {
    app.use(cors());
    app.use(bodyParser());
    app.use(errorHandleMd);
    // app.use(jwtMd);
    app.use(Router.routes()).use(Router.allowedMethods());
    // app.use(serve(path.join(__dirname, "../upload")));
    server.listen(3000);
    /* eslint-disable no-alert, no-console */
    console.log("WR server started [port:3000]");
    await db();
  } catch (e) {
    console.log(e);
  }
};

main();
