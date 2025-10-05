import { Router } from "express";
import { deserializeUser } from "../middleware/req-m.js";
import { getResults } from "../handlers/ai-route.js";
const router = Router();
router.post("/ai/get-results", deserializeUser, getResults);
export default router;
