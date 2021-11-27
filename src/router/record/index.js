import Router from "@koa/router";
import * as record from "./record";

const router = new Router();

// 기록 생성
router.post("/", ...record.create);

// 내 기록 읽어오기
router.get("/list", ...record.readMy);

// 기록 하나 가져오기
router.get("/read/:uid", ...record.readByUid);

export default router;
