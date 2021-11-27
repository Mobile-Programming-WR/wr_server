import Router from "@koa/router";
import * as record from "./record";

const router = new Router();

// 기록 생성
router.post("/", ...record.create);

router.get("/list", ...record.readMy);

export default router;
