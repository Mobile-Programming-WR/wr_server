import Router from "@koa/router";
import * as member from "./member";

const router = new Router();

// 생성
router.post("/", ...member.create);

export default router;