import { Router } from "express";
import { deserializeUser } from "../middleware/req-m.ts";
import { getResults } from "../handlers/ai-route.ts";
const router = Router()

router.post("/ai/get-results", deserializeUser, getResults)

export default router