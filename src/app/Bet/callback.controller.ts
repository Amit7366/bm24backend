import { Request, Response } from "express";
import Bet from "../Bet/bet.model";
import { UserBalance } from "../Transaction/userBalance.model";
import { BetTransaction } from "../Transaction/betTransaction.model";
import mongoose from "mongoose";

export const handleCallback = async (req: Request, res: Response) => {
  // Merge both body and query, body takes priority
  const data = {
    ...req.query,
    ...req.body,
  };

  const {
    game_uid,
    game_round,
    bet_amount,
    currency_code,
    win_amount,
    serial_number,
    member_account,
    timestamp,
  } = data;

  // Safety: ensure they're strings/numbers
  if (
    !String(game_uid) ||
    !String(member_account) ||
    win_amount === undefined || win_amount === null
  ) {
    return res.status(400).json({ error: "Missing required callback fields" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bet = await Bet.findOne({
      userId: String(member_account),
      gameId: String(game_uid),
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .session(session);

    if (!bet) throw new Error("Matching pending bet not found");

    const userBalance = await UserBalance.findOne({ userId: String(member_account) }).session(session);
    if (!userBalance) throw new Error("User balance not found");

    const winAmount = parseFloat(String(win_amount));
    let resultStatus: "win" | "lose" = "lose";

    if (winAmount > 0) {
      bet.status = "win";
      bet.winAmount = winAmount;
      userBalance.currentBalance += winAmount;

      await new BetTransaction({
        userId: String(member_account),
        amount: winAmount,
        type: "win",
        status: "completed",
        metadata: {
          betId: bet._id,
          gameId: String(game_uid),
          roundId: String(game_round),
          serialNumber: String(serial_number),
          currencyCode: String(currency_code),
        },
      }).save({ session });

      resultStatus = "win";
    } else {
      bet.status = "lose";
      bet.winAmount = 0;
    }

    await bet.save({ session });
    await userBalance.save({ session });
    await session.commitTransaction();

    return res.json({
      credit_amount: winAmount,
      result: resultStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Callback error:", error);
    return res.status(500).json({ error: (error as any).message || "Internal error" });
  } finally {
    session.endSession();
  }
};


