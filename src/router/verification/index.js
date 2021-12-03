import Router from "@koa/router";
import * as verification from "./verification";

const router = new Router();

// 전화번호 인증번호 발송
router.post("/sms", ...verification.postVerifySms);

// 전화번호 인증번호 확인
router.post("/sms/verify", ...verification.confirmVerifySms);

export default router;
