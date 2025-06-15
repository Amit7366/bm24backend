import { Model, Types } from 'mongoose';

// Define types for gender and blood group
export type TGender = 'male' | 'female' | 'other';
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';
// Define the TNormalUser interface
export type TNormalUser = {
  _id: any; // Consider using Types.ObjectId for consistency
  id: string;
  user: Types.ObjectId; // User reference type
  ip?: string;
  country?: string;
  designation?: string;
  name: string;
  userName: string;
  age: number;
  contactNo: string;
  referralId?: string;
  referredBy?: string;
  refferCount?: number;
  _referrerUserId?: Types.ObjectId;
  gender?: TGender;
  dateOfBirth?: Date;
  email?: string;
  emergencyContactNo?: string;
  bloodGroup?: TBloodGroup;
  state?: string;
  city?: string;
  postalCode?: string;
  presentAddress?: string;
  permanentAddress?: string;
  userLevel?: {
    type: string;
    enum: ['Normal', 'Bronze', 'Silver', 'Gold', 'Platinum'];
    default: 'Normal';
  };
  device?: string;
  deviceFingerprint?: string;
  profileImg?: string;
  isDeleted?: boolean;
};

// Define the NormalUserModel interface with static methods
export interface NormalUserModel extends Model<TNormalUser> {
  isUserExists(id: string): Promise<TNormalUser | null>;
  isIPExists(ip: string): Promise<TNormalUser | null>;
  // isDeviceExists(device: string): Promise<TNormalUser | null>;
  // isDeviceSignatureExists(deviceSignature: string): Promise<TNormalUser | null>;
}
