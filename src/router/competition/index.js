import Router from "@koa/router";
import * as competition from "./competition";

const router = new Router();

// 겨루기 조회
router.get("/:id", ...competition.readById);

export default router;
