import { Types } from "mongoose";

export interface IReferral {
  referredUser: Types.ObjectId;
  referrer: Types.ObjectId;
  referredAt?: Date;
}
