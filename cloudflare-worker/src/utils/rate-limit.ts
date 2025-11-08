import { incrementCounter, getCounter } from './kv.js';

export const RATE_LIMITS = {
  pinAttempts: {
    max: 5,
    window: 3600, // 1 hour
  },
};

/**
 * Check if rate limit exceeded for PIN attempts
 * 
 * @param kv - KV namespace binding
 * @param tokenHash - Token hash to check
 * @returns Object with exceeded flag and remaining attempts
 */
export async function checkPinRateLimit(
  kv: KVNamespace,
  tokenHash: string
): Promise<{ exceeded: boolean; attempts: number; remaining: number }> {
  const key = `pin_attempts:${tokenHash}`;
  const attempts = await getCounter(kv, key);
  const remaining = Math.max(0, RATE_LIMITS.pinAttempts.max - attempts);
  const exceeded = attempts >= RATE_LIMITS.pinAttempts.max;

  return { exceeded, attempts, remaining };
}

/**
 * Increment PIN attempt counter
 * 
 * @param kv - KV namespace binding
 * @param tokenHash - Token hash
 * @returns New attempt count
 */
export async function incrementPinAttempts(
  kv: KVNamespace,
  tokenHash: string
): Promise<number> {
  const key = `pin_attempts:${tokenHash}`;
  return await incrementCounter(kv, key, RATE_LIMITS.pinAttempts.window);
}

