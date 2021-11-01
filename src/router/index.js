import Router from "@koa/router";
import user from "./user";

const router = new Router({
  prefix: "/api/wr/v1",
});

router.use("/user", user.routes());

export default router;
