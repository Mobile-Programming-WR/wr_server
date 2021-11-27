import Router from "@koa/router";
import * as challenge from "./challenge";

const router = new Router();

// 챌린지 가져오기
router.get("/", ...challenge.read);

export default router;
