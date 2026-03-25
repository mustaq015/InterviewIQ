import CryptoJS from 'crypto-js';
import type { EncryptedData } from '../types';

const SALT = 'InterviewIQ_Salt_v1';
const ITERATIONS = 10000;
const KEY_SIZE = 256 / 32;

export function deriveKey(password: string, salt: string = SALT): CryptoJS.lib.WordArray {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: KEY_SIZE,
    iterations: ITERATIONS
  });
}

export function encrypt(data: unknown, password: string): EncryptedData {
  const key = deriveKey(password);
  const iv = CryptoJS.lib.WordArray.random(16);
  
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return {
    iv: iv.toString(CryptoJS.enc.Hex),
    data: encrypted.toString()
  };
}

export function decrypt(encryptedData: EncryptedData, password: string): unknown {
  const key = deriveKey(password);
  const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
  
  const decrypted = CryptoJS.AES.decrypt(encryptedData.data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  try {
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch {
    throw new Error('Failed to decrypt data - invalid password or corrupted data');
  }
}

export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password + SALT).toString();
}
