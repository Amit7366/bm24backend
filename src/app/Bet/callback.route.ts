// src/routes/callback.route.ts
import { Router } from "express";
import { handleCallback } from "./callback.controller";

const router = Router();

// Support both POST and GET
router.post("/", handleCallback);
router.get("/", handleCallback);

export const callbackRoute= router;
