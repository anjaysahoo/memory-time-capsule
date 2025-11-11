/**
 * Gmail API client for sending emails
 */

export interface GmailTokens {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
}

/**
 * Exchange OAuth code for tokens
 * 
 * @param code - OAuth authorization code
 * @param clientId - Gmail OAuth client ID
 * @param clientSecret - Gmail OAuth client secret
 * @param redirectUri - OAuth redirect URI
 * @returns Access and refresh tokens
 */
export async function exchangeCodeForGmailTokens(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<GmailTokens> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    throw new Error(`Gmail OAuth failed: ${response.statusText}`);
  }

  const data = await response.json() as any;

  if (data.error) {
    throw new Error(`Gmail OAuth error: ${data.error_description || data.error}`);
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: Date.now() + (data.expires_in * 1000),
  };
}

/**
 * Refresh access token using refresh token
 * 
 * @param refreshToken - Gmail refresh token
 * @param clientId - Gmail OAuth client ID
 * @param clientSecret - Gmail OAuth client secret
 * @returns New access token
 */
export async function refreshGmailAccessToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<{ access_token: string; expiry_date: number }> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error(`Gmail token refresh failed: ${response.statusText}`);
  }

  const data = await response.json() as any;

  return {
    access_token: data.access_token,
    expiry_date: Date.now() + (data.expires_in * 1000),
  };
}

/**
 * Base64url encode a string (compatible with Cloudflare Workers)
 */
function base64urlEncode(str: string): string {
  // Convert string to UTF-8 bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  
  // Convert to base64
  let binary = '';
  const len = data.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(data[i]);
  }
  
  // Use btoa on binary string and convert to base64url
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Encode email subject with UTF-8 support (RFC 2047)
 */
function encodeSubject(subject: string): string {
  // Check if subject contains non-ASCII characters
  if (/^[\x00-\x7F]*$/.test(subject)) {
    // Pure ASCII, no encoding needed
    return subject;
  }
  
  // Encode as UTF-8 Base64 for non-ASCII characters
  const encoder = new TextEncoder();
  const data = encoder.encode(subject);
  
  let binary = '';
  for (let i = 0; i < data.byteLength; i++) {
    binary += String.fromCharCode(data[i]);
  }
  
  const base64 = btoa(binary);
  return `=?UTF-8?B?${base64}?=`;
}

/**
 * Send email via Gmail API
 * 
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param htmlBody - Email HTML body
 * @param textBody - Email plain text body (fallback)
 * @param accessToken - Gmail access token
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string,
  textBody: string,
  accessToken: string
): Promise<void> {
  // Create MIME message with properly encoded subject
  const message = [
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="boundary"',
    '',
    '--boundary',
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    textBody,
    '',
    '--boundary',
    'Content-Type: text/html; charset="UTF-8"',
    '',
    htmlBody,
    '',
    '--boundary--',
  ].join('\r\n');

  // Base64url encode message
  const encodedMessage = base64urlEncode(message);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedMessage,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gmail send failed: ${error}`);
  }
}

/**
 * Get valid access token (refresh if expired)
 * 
 * @param tokens - Current Gmail tokens
 * @param clientId - Gmail OAuth client ID
 * @param clientSecret - Gmail OAuth client secret
 * @returns Valid access token
 */
export async function getValidAccessToken(
  tokens: GmailTokens,
  clientId: string,
  clientSecret: string
): Promise<string> {
  // Check if token is expired or will expire in next 5 minutes
  if (tokens.expiry_date < Date.now() + (5 * 60 * 1000)) {
    const refreshed = await refreshGmailAccessToken(
      tokens.refresh_token,
      clientId,
      clientSecret
    );
    return refreshed.access_token;
  }

  return tokens.access_token;
}

