import { Router } from "express";
import { launchGame } from "./game.controller";
const router = Router();
router.get("/", launchGame);
router.post("/", launchGame);
export const launchGameRoute = router;

