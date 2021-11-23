import Router from "@koa/router";
import user from "./user";
import friend from "./friend";

const router = new Router({
  prefix: "/api/wr/v1",
});

router.use("/user", user.routes());
router.use("/friend", friend.routes());
export default router;
