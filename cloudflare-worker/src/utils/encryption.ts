/**
 * Encryption utilities using AES-256-GCM
 * Used for encrypting OAuth tokens before storing in KV
 */

export interface EncryptedData {
  ciphertext: string;  // base64url encoded
  iv: string;          // base64url encoded initialization vector
  tag: string;         // base64url encoded authentication tag
}

/**
 * Generate a random initialization vector (96 bits for GCM)
 */
function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12));
}

/**
 * Convert hex string to Uint8Array
 */
function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Base64url encode a Uint8Array
 */
function base64urlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Base64url decode to Uint8Array
 */
function base64urlDecode(str: string): Uint8Array {
  // Add padding
  const base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(str.length + ((4 - (str.length % 4)) % 4), '=');
  
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Import the encryption key from hex string
 */
async function importKey(encryptionKey: string): Promise<CryptoKey> {
  const keyData = hexToUint8Array(encryptionKey);
  
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt plaintext using AES-256-GCM
 * 
 * @param plaintext - Data to encrypt (e.g., OAuth token)
 * @param encryptionKey - 32-byte hex encryption key
 * @returns Encrypted data with IV and authentication tag
 */
export async function encrypt(
  plaintext: string,
  encryptionKey: string
): Promise<EncryptedData> {
  const key = await importKey(encryptionKey);
  const iv = generateIV();
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    data
  );

  // Split encrypted data into ciphertext and authentication tag
  const encryptedArray = new Uint8Array(encrypted);
  const ciphertext = encryptedArray.slice(0, -16); // All but last 16 bytes
  const tag = encryptedArray.slice(-16); // Last 16 bytes

  return {
    ciphertext: base64urlEncode(ciphertext),
    iv: base64urlEncode(iv),
    tag: base64urlEncode(tag),
  };
}

/**
 * Decrypt ciphertext using AES-256-GCM
 * 
 * @param encrypted - Encrypted data object
 * @param encryptionKey - 32-byte hex encryption key
 * @returns Decrypted plaintext
 * @throws Error if decryption fails (wrong key or tampered data)
 */
export async function decrypt(
  encrypted: EncryptedData,
  encryptionKey: string
): Promise<string> {
  const key = await importKey(encryptionKey);
  const iv = base64urlDecode(encrypted.iv);
  const ciphertext = base64urlDecode(encrypted.ciphertext);
  const tag = base64urlDecode(encrypted.tag);

  // Combine ciphertext and tag
  const encryptedData = new Uint8Array(ciphertext.length + tag.length);
  encryptedData.set(ciphertext, 0);
  encryptedData.set(tag, ciphertext.length);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      key,
      encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    throw new Error('Decryption failed: Invalid key or corrupted data');
  }
}

/**
 * Hash a string using SHA-256 (for token hashing)
 * 
 * @param data - String to hash
 * @returns Hex-encoded hash
 */
export async function sha256Hash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = new Uint8Array(hashBuffer);
  
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a cryptographically secure random token
 * 
 * @param byteLength - Length in bytes (default 16 = 128 bits)
 * @returns Base64url-encoded random token
 */
export function generateSecureToken(byteLength: number = 16): string {
  const buffer = crypto.getRandomValues(new Uint8Array(byteLength));
  return base64urlEncode(buffer);
}

