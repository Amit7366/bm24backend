import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      unique: true,
    },
    device: {
      type: String,
      // required: [true, 'Device is required'],
      // unique: true, // Ensure one account per device
    },
    
    
    userName: { type: String,unique: true },
    contactNo: { type: String ,
      unique: true},
    referralId: { type: String, unique: true },
    referredBy: { type: String, default: null },
    refferCount: {
      type: Number,
      default: 0,
    },
    email: { type: String },
    userLevel: {
  type: String,
  enum: ['Normal', 'Bronze', 'Silver', 'Gold', 'Platinum'],
  default: 'Normal',
},
    password: { type: String, required: true, select: false },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangeAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'user', 'advertiser'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    country: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    age: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round) || 10, // Default to 10 if not set
  );
  next();
});

// userSchema.statics.isUserExistsByCustomId = async function (id: string) {
//   return await this.findOne({ id }).select('+password');
// };

// userSchema.statics.isUserExistsByEmail = async function (email: string) {
//   return await this.findOne({ email }).select('+password');
// };
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  console.log(`Querying user by custom ID: ${id}`);
  const user = await this.findOne({ id }).select('+password');
  console.log('Result:', user);
  return user;
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  console.log(`Querying user by email: ${email}`);
  const user = await this.findOne({ email }).select('+password');
  console.log('Result:', user);
  return user;
};
userSchema.statics.isUserExistsByUserName = async function (userName: string) {
  console.log(`Querying user by userName: ${userName}`);
  const user = await this.findOne({ userName }).select('+password');
  console.log('Result:', user);
  return user;
};
userSchema.statics.isUserExistsByContactNo = async function (contactNo: string) {
  console.log(`Querying user by contactNo: ${contactNo}`);
  const user = await this.findOne({ contactNo }).select('+password');
  console.log('Result:', user);
  return user;
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};
export const User = model<TUser, UserModel>('User', userSchema);
