import { EncryptedData, encrypt, decrypt } from './encryption.js';

/**
 * KV storage key patterns
 */
export const KV_KEYS = {
  // User tokens
  githubToken: (userId: string) => `github_token:${userId}`,
  gmailToken: (userId: string) => `gmail_token:${userId}`,
  userSession: (userId: string) => `user_session:${userId}`,
  
  // Capsule mappings
  tokenToRepo: (tokenHash: string) => `token:${tokenHash}`,
  
  // Rate limiting
  pinAttempts: (tokenHash: string) => `pin_attempts:${tokenHash}`,
};

/**
 * Store encrypted token in KV (no expiration for long-term storage)
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @param token - Token to encrypt and store
 * @param encryptionKey - Master encryption key
 */
export async function storeEncryptedToken(
  kv: KVNamespace,
  key: string,
  token: string,
  encryptionKey: string
): Promise<void> {
  const encrypted = await encrypt(token, encryptionKey);
  await kv.put(key, JSON.stringify(encrypted));
}

/**
 * Retrieve and decrypt token from KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @param encryptionKey - Master encryption key
 * @returns Decrypted token or null if not found
 */
export async function getEncryptedToken(
  kv: KVNamespace,
  key: string,
  encryptionKey: string
): Promise<string | null> {
  const encryptedJson = await kv.get(key);
  
  if (!encryptedJson) {
    return null;
  }

  try {
    const encrypted: EncryptedData = JSON.parse(encryptedJson);
    return await decrypt(encrypted, encryptionKey);
  } catch (error) {
    console.error('Failed to decrypt token:', error);
    return null;
  }
}

/**
 * Delete token from KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 */
export async function deleteToken(
  kv: KVNamespace,
  key: string
): Promise<void> {
  await kv.delete(key);
}

/**
 * Store JSON data in KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @param data - Data to store (will be JSON stringified)
 * @param expirationTtl - Optional TTL in seconds
 */
export async function storeJson<T>(
  kv: KVNamespace,
  key: string,
  data: T,
  expirationTtl?: number
): Promise<void> {
  const options = expirationTtl ? { expirationTtl } : undefined;
  await kv.put(key, JSON.stringify(data), options);
}

/**
 * Retrieve JSON data from KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @returns Parsed JSON data or null if not found
 */
export async function getJson<T>(
  kv: KVNamespace,
  key: string
): Promise<T | null> {
  const json = await kv.get(key);
  
  if (!json) {
    return null;
  }

  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Failed to parse JSON from KV:', error);
    return null;
  }
}

/**
 * Check if key exists in KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @returns true if key exists
 */
export async function exists(
  kv: KVNamespace,
  key: string
): Promise<boolean> {
  const value = await kv.get(key);
  return value !== null;
}

/**
 * Increment counter in KV (for rate limiting)
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @param expirationTtl - TTL in seconds (default 3600 = 1 hour)
 * @returns New counter value
 */
export async function incrementCounter(
  kv: KVNamespace,
  key: string,
  expirationTtl: number = 3600
): Promise<number> {
  const current = await getJson<{ count: number }>(kv, key);
  const newCount = (current?.count || 0) + 1;
  
  await storeJson(kv, key, { count: newCount }, expirationTtl);
  return newCount;
}

/**
 * Get counter value from KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @returns Counter value (0 if not found)
 */
export async function getCounter(
  kv: KVNamespace,
  key: string
): Promise<number> {
  const data = await getJson<{ count: number }>(kv, key);
  return data?.count || 0;
}

/**
 * Reset counter in KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 */
export async function resetCounter(
  kv: KVNamespace,
  key: string
): Promise<void> {
  await kv.delete(key);
}

