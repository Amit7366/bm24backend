// src/utils/userLevel.util.ts

export type UserLevel = 'Normal' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export const determineUserLevel = (totalDeposit: number): UserLevel => {
    if (totalDeposit >= 4000000) return 'Platinum';
    if (totalDeposit >= 2200000) return 'Gold';
    if (totalDeposit >= 900000) return 'Silver';
    if (totalDeposit >= 300000) return 'Bronze';
    return 'Normal';
};
