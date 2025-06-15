// src/config/index.ts
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,

  // Auth & Security
  bcrypt_salt_round: process.env.BCEYPT_SALT_ROUND,
  default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,

  // Email
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,

  // Cloudinary
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,

  // Admin
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,

  // Payment
  payment_secret_key: process.env.PAYMENT_SECRET_KEY,
  paypal_client_id: process.env.PAYPAL_CLIENT_ID,
  paypal_secret: process.env.PAYPAL_SECRET,
  paypal_base_url: process.env.PAYPAL_BASE_URL,

  // URLs
  base_url: process.env.BASE_URL,

  // Playwin
  playwin_secret_key: process.env.PLAYWIN_SECRET_KEY,
  playwin_api_base: process.env.PLAYWIN_API_BASE,

  // Bkash
  bkash_base_url: process.env.BKASH_BASE_URL,
  bkash_app_key: process.env.BKASH_APP_KEY,
  bkash_app_secret: process.env.BKASH_APP_SECRET,
  bkash_username: process.env.BKASH_USERNAME,
  bkash_password: process.env.BKASH_PASSWORD,
  bkash_callback_url: process.env.BKASH_CALLBACK_URL,
};
