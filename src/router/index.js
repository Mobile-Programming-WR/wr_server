import Router from "@koa/router";
import member from "./member";

const router = new Router({
    prefix: "/api/wr/v1",
});

router.use("/member", member.routes());

export default router;