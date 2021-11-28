import Router from "@koa/router";
import user from "./user";
import friend from "./friend";
import record from "./record";
import challenge from "./challenge";
import competition from "./competition";

const router = new Router({
  prefix: "/api/wr/v1",
});

router.use("/user", user.routes());
router.use("/friend", friend.routes());
router.use("/record", record.routes());
router.use("/challenge", challenge.routes());
router.use("/competition", competition.routes());
export default router;
