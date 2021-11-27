import Router from "@koa/router";
import * as friend from "./friend";

const router = new Router();

// 친구 요청
router.get("/add/:id", ...friend.add);

// 요청 수락
router.get("/accept/:id", ...friend.accept);

// 친구 삭제
router.delete("/:id", ...friend.remove);

// 친구 목록
router.get("/list", ...friend.readFriends);
// 친구 요청 목록
router.get("/requestlist", ...friend.readRequest);

// 친구 삭제
router.delete("/", ...friend.remove);
// 겨루기 신청
router.get("/competition/:id", ...friend.requestCompetition);
export default router;
