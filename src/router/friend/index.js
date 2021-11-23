import Router from "@koa/router";
import * as friend from "./friend";

const router = new Router();

// 친구 요청
router.post("/add", ...friend.add);

// 요청 수락
router.post("/accept", ...friend.accept);

// 친구 삭제
router.delete("/", ...friend.remove);

// 친구 목록
router.get("/list", ...friend.readFriends);
// 친구 요청 목록
router.get("/requestlist", ...friend.readRequest);
export default router;
