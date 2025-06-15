import crypto from 'crypto';
export function aes256Encrypt(key: string, plaintext: string): string {
  const bufferKey = Buffer.from(key, 'utf8');
  const cipher = crypto.createCipheriv('aes-256-ecb', bufferKey, null);
  cipher.setAutoPadding(true);
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}