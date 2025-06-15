import mongoose from 'mongoose';
import { isSameDay, subDays } from 'date-fns';
import { UserBalance } from '../Transaction/userBalance.model';
import { CheckinModel } from './checkin.model';

const handleCheckin = async (userId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userBalance = await UserBalance.findOne({ userId }).session(session);
        if (!userBalance || userBalance.totalDeposit < 1) {
            throw new Error('You must deposit at least once to be eligible.');
        }

        let checkin = await CheckinModel.findOne({ userId }).session(session);
        if (!checkin) {
            checkin = new CheckinModel({ userId, checkinDates: [] });
        }

        const alreadyCheckedToday = checkin.checkinDates.some((date: Date | string) =>
            isSameDay(new Date(date), today)
        );
        if (alreadyCheckedToday) {
            throw new Error('Already checked in today.');
        }

        checkin.checkinDates.push(today);

        // Filter last 7 days and sort with types
        checkin.checkinDates = checkin.checkinDates
            .filter((date: Date | string) => {
                const diffDays = (today.getTime() - new Date(date).getTime()) / (1000 * 3600 * 24);
                return diffDays <= 7;
            })
            .sort((a: Date | string, b: Date | string) => {
                return new Date(a).getTime() - new Date(b).getTime();
            });

        let isStreak = false;

        if (checkin.checkinDates.length === 7) {
            isStreak = checkin.checkinDates.every((date: Date | string, i: number) => {
                const expected = subDays(today, 6 - i);
                return isSameDay(new Date(date), expected);
            });
        }

        if (isStreak && !checkin.rewardGiven) {
            await UserBalance.findOneAndUpdate(
                { userId },
                {
                    $inc: {
                        currentCoinBalance: 1200,
                        totalCoinDeposit: 1200,
                    },
                },
                { session }
            );
            checkin.rewardGiven = true;
        }

        await checkin.save({ session });
        await session.commitTransaction();
        session.endSession();

        return {
            message: isStreak
                ? '7-day streak completed. You received 1200 coins!'
                : 'Check-in successful!',
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const checkinservice = {
    handleCheckin,
};
