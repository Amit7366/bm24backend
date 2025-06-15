export type TValueType = 'fixed' | 'percent';
export type TOfferStatus = 'on' | 'off';

export interface IUserOffer {
    offerName: string;
    value: number;
    valueType: TValueType;
    status: TOfferStatus;
    activeDates: number[];
}
