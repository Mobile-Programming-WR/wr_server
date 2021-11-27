import Router from "@koa/router";
import user from "./user";
import friend from "./friend";
import record from "./record";

const router = new Router({
  prefix: "/api/wr/v1",
});

router.use("/user", user.routes());
router.use("/friend", friend.routes());
router.use("/record", record.routes());
export default router;
