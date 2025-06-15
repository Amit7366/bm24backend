// src/controllers/game.controller.ts
import { Request, Response } from "express";
import axios from "axios";
import mongoose from "mongoose";
import Bet from "../Bet/bet.model";
import { UserBalance } from "../Transaction/userBalance.model";
import { BetTransaction } from "../Transaction/betTransaction.model";
import { aes256Encrypt } from "./encryption";
import config from "../config";

export const launchGame = async (req: Request, res: Response) => {
  const {
    user_id,
    wallet_amount,
    game_uid,
    token,
    timestamp,
  } = req.method === "GET" ? req.query : req.body;

  if (!user_id || !wallet_amount || !game_uid || !token || !timestamp) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const userIdStr = String(user_id);
  const gameUidStr = String(game_uid);
  const tokenStr = String(token);
  const timestampStr = String(timestamp);
  const walletAmountNum = parseFloat(wallet_amount as string);

  const payloadObj = {
    user_id: userIdStr,
    wallet_amount: walletAmountNum,
    game_uid: gameUidStr,
    token: tokenStr,
    timestamp: timestampStr,
  };

  const secretKey = process.env.PLAYWIN_SECRET_KEY!;
  const encryptedPayload = aes256Encrypt(secretKey, JSON.stringify(payloadObj));

  const session = await mongoose.startSession();
  session.startTransaction();
  let committed = false;

  try {
    const userBalance = await UserBalance.findOne({ userId: userIdStr }).session(session);
    if (!userBalance || userBalance.currentBalance < walletAmountNum) {
      throw new Error("Insufficient balance");
    }

    userBalance.currentBalance -= walletAmountNum;
    await userBalance.save({ session });

    const bet = new Bet({
      userId: userIdStr,
      gameId: gameUidStr,
      betAmount: walletAmountNum,
      odds: 1,
      betType: "playwin",
      status: "pending",
    });
    await bet.save({ session });

    await new BetTransaction({
      userId: userIdStr,
      amount: walletAmountNum,
      type: "bet",
      status: "completed",
      metadata: {
        betId: bet._id,
        gameId: gameUidStr,
      },
    }).save({ session });

    await session.commitTransaction();
    committed = true;

    
    const playwinUrl = `${config.playwin_api_base}/launchGame`;
    const response = await axios.get(playwinUrl, {
      params: {
        ...payloadObj,
        payload: encryptedPayload,
      },
    });

    if (response?.request?.res?.responseUrl) {
      return res.json({ url: response.request.res.responseUrl });
    } else {
      return res.status(400).json({ error: "Launch failed" });
    }
  } catch (error) {
    if (!committed && session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error("Launch game error:", error);
    return res.status(500).json({
      error: "Something went wrong",
      message: (error as any)?.message || "Unknown error",
    });
  } finally {
    session.endSession();
  }
};
