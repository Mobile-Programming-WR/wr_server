import Router from "@koa/router";
import user from "./user";
import friend from "./friend";
import record from "./record";
import challenge from "./challenge";
import competition from "./competition";
import verification from "./verification";

const router = new Router({
  prefix: "/api/wr/v1",
});

router.use("/user", user.routes());
router.use("/friend", friend.routes());
router.use("/record", record.routes());
router.use("/challenge", challenge.routes());
router.use("/competition", competition.routes());
router.use("/verify", verification.routes());
export default router;
