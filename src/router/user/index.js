import Router from "@koa/router";
import * as user from "./user";

const router = new Router();

// 생성
router.post("/", ...user.create);

// 로그인
router.post("/login", ...user.login);

router.post("/changePw", ...user.changePw);
export default router;
