/**
 * Generate GitHub Actions workflow for unlocking capsules
 */

export function generateUnlockWorkflow(
    gmailClientId: string,
    gmailClientSecret: string
): string {
    return `name: Unlock Time Capsules

on:
  schedule:
    # Run every hour at minute 0
    - cron: '0 * * * *'
  workflow_dispatch: # Allow manual trigger for testing

permissions:
  contents: write  # Allow workflow to commit and push changes

jobs:
  unlock:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}
          lfs: true
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          echo '{"type":"commonjs"}' > package.json
          npm install googleapis
      
      - name: Run unlock script
        env:
          GMAIL_REFRESH_TOKEN: \${{ secrets.GMAIL_REFRESH_TOKEN }}
          GMAIL_CLIENT_ID: \${{ secrets.GMAIL_CLIENT_ID }}
          GMAIL_CLIENT_SECRET: \${{ secrets.GMAIL_CLIENT_SECRET }}
          FRONTEND_URL: \${{ secrets.FRONTEND_URL }}
        run: node unlock-script.js
      
      - name: Commit updated capsules.json
        run: |
          git config user.name "Time Capsule Bot"
          git config user.email "bot@timecapsule.app"
          git add capsules.json
          git diff --quiet && git diff --staged --quiet || git commit -m "Update capsule unlock status [automated]"
          git push
`;
}

/**
 * Generate unlock script that runs in GitHub Actions
 */
export function generateUnlockScript(): string {
    return `// unlock-script.js - Runs in GitHub Actions to unlock capsules

const fs = require('fs');
const { google } = require('googleapis');

// Main async function
async function main() {
  // Initialize Gmail client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Read capsules.json
  const capsules = JSON.parse(fs.readFileSync('capsules.json', 'utf8'));
  const now = Math.floor(Date.now() / 1000);
  let updated = false;

  console.log(\`Checking \${capsules.length} capsules at \${new Date().toISOString()}\`);

  // Process each capsule
  for (const capsule of capsules) {
    // Skip if already sent unlock email
    if (capsule.unlockEmailSent) {
      continue;
    }

    // Check if unlock time has passed
    if (capsule.unlockAt <= now) {
      console.log(\`Unlocking capsule: \${capsule.id} - \${capsule.title}\`);

      try {
        // Generate 4-digit PIN
        const pin = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        const pinHash = require('crypto').createHash('sha256').update(pin).digest('hex');

        // Update capsule metadata
        capsule.pin = pin;
        capsule.pinHash = pinHash;
        capsule.unlockEmailSent = true;
        capsule.unlockedAt = now;

        // Send unlock email to recipient
        await sendUnlockEmail(capsule, pin, gmail);

        // Send notification to sender
        await sendSenderNotification(capsule, gmail);

        console.log(\`✓ Capsule \${capsule.id} unlocked successfully\`);
        updated = true;

      } catch (error) {
        console.error(\`✗ Failed to unlock capsule \${capsule.id}:\`, error.message);
      }
    }
  }

  // Write updated capsules.json if any changes
  if (updated) {
    fs.writeFileSync('capsules.json', JSON.stringify(capsules, null, 2));
    console.log('Updated capsules.json');
  } else {
    console.log('No capsules to unlock');
  }
}

// Email sending functions
async function sendUnlockEmail(capsule, pin, gmail) {
  const unlockDate = new Date(capsule.unlockAt * 1000).toLocaleDateString();
  const magicLink = \`\${process.env.FRONTEND_URL}/open?t=\${capsule.magicToken}\`;

  const html = generateUnlockEmailHtml(capsule, pin, magicLink, unlockDate);
  const text = generateUnlockEmailText(capsule, pin, magicLink, unlockDate);

  await sendGmailMessage(
    gmail,
    capsule.recipientEmail,
    \`🎉 Your time capsule from \${capsule.senderName} is unlocked!\`,
    html,
    text
  );
}

async function sendSenderNotification(capsule, gmail) {
  const magicLink = \`\${process.env.FRONTEND_URL}/open?t=\${capsule.magicToken}\`;
  const whatsappLink = \`https://wa.me/?text=\${encodeURIComponent(
    \`Hi! Your time capsule "\${capsule.title}" is now unlocked! View it here: \${magicLink}\`
  )}\`;

  const html = generateSenderNotificationHtml(capsule, whatsappLink);
  const text = generateSenderNotificationText(capsule, whatsappLink);

  await sendGmailMessage(
    gmail,
    capsule.senderEmail,
    \`✅ Your capsule to \${capsule.recipientEmail} unlocked\`,
    html,
    text
  );
}

async function sendGmailMessage(gmail, to, subject, html, text) {
  // Encode subject for RFC 2047 (MIME encoded-word) to handle emojis
  const encodedSubject = '=?UTF-8?B?' + Buffer.from(subject).toString('base64') + '?=';

  const message = [
    \`To: \${to}\`,
    \`Subject: \${encodedSubject}\`,
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="boundary"',
    '',
    '--boundary',
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    text,
    '',
    '--boundary',
    'Content-Type: text/html; charset="UTF-8"',
    '',
    html,
    '',
    '--boundary--',
  ].join('\\r\\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage },
  });
}

// Email template functions (inline versions)
function generateUnlockEmailHtml(capsule, pin, magicLink, unlockDate) {
  return \`
<!DOCTYPE html>
<html>
<body style="margin:0; padding:32px 16px; background:#000; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:640px; margin:0 auto;">
    <div style="text-align:center; margin-bottom:24px;">
      <h1 style="margin:0 0 8px; font-size:26px; font-weight:700; letter-spacing:0.03em;">
        Your Time Capsule is Unlocked
      </h1>
      <p style="margin:0; font-size:14px; opacity:0.7;">
        A message from the past has arrived.
      </p>
    </div>

    <div style="background:#050509; border:1px solid #1f2933; border-radius:14px; padding:24px 20px;">
      <p style="margin:0 0 12px; font-size:16px; line-height:1.7;">
        Your time capsule from <em>\${capsule.senderName}</em> is now open.
      </p>

      <h2 style="margin:4px 0 10px; font-size:20px; font-weight:600;">
        \${capsule.title}
      </h2>

      <div style="margin:18px 0 20px; padding:18px 16px; border-radius:10px; border:1px solid #273549; background:#020306;">
        <div style="font-size:13px; text-transform:uppercase; letter-spacing:0.15em; opacity:0.7; margin-bottom:6px;">
          Access Pin
        </div>
        <p style="margin:4px 0 0; font-size:26px; font-weight:600; letter-spacing:0.25em; text-align:center;">
          \${pin}
        </p>
      </div>

      <p style="margin:0 0 18px; font-size:14px; opacity:0.85;">
        Unlock date: <em>\${unlockDate}</em>
      </p>

      <p style="margin:0 0 4px; text-align:center;">
        <a href="\${magicLink}"
           style="display:inline-block; padding:12px 28px; border-radius:999px; background:#f5f5f5; color:#000; text-decoration:none; font-size:15px; font-weight:600;">
          Open Time Capsule
        </a>
      </p>
    </div>
  </div>
</body>
</html>
  \`;
}

function generateUnlockEmailText(capsule, pin, magicLink, unlockDate) {
  return \`
Your Time Capsule is Unlocked

Your time capsule from \${capsule.senderName} is now open: "\${capsule.title}".

Unlock date: \${unlockDate}
PIN: \${pin}

Open your capsule: \${magicLink}
  \`;
}

function generateSenderNotificationHtml(capsule, whatsappLink) {
  return \`
<!DOCTYPE html>
<html>
<body style="margin:0; padding:32px 16px; background:#000; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:640px; margin:0 auto;">
    <div style="text-align:center; margin-bottom:24px;">
      <h1 style="margin:0 0 8px; font-size:24px; font-weight:700; letter-spacing:0.03em;">
        Capsule Delivered
      </h1>
      <p style="margin:0; font-size:14px; opacity:0.7;">
        Your message has reached its destination.
      </p>
    </div>

    <div style="background:#050509; border:1px solid #1f2933; border-radius:14px; padding:24px 20px;">
      <p style="margin:0 0 12px; font-size:16px; line-height:1.7;">
        Hi <em>\${capsule.senderName}</em>,
      </p>

      <p style="margin:0 0 12px; font-size:15px; line-height:1.7;">
        Your time capsule has been unlocked and delivered to
        <em>\${capsule.recipientEmail}</em>.
      </p>

      <h2 style="margin:4px 0 16px; font-size:20px; font-weight:600;">
        \${capsule.title}
      </h2>

      <p style="margin:0 0 10px; font-size:14px; opacity:0.85;">
        If you'd like, you can gently remind them via WhatsApp:
      </p>

      <p style="margin:0; text-align:center;">
        <a href="\${whatsappLink}"
           style="display:inline-block; padding:10px 22px; border-radius:999px; background:#25D366; color:#000; text-decoration:none; font-size:14px; font-weight:600;">
          📱 Send WhatsApp Reminder
        </a>
      </p>
    </div>
  </div>
</body>
</html>
  \`;
}

function generateSenderNotificationText(capsule, whatsappLink) {
  return \`
Your Time Capsule Has Unlocked

Your time capsule "\${capsule.title}" has been unlocked and delivered to \${capsule.recipientEmail}.

Send WhatsApp reminder (optional): \${whatsappLink}
  \`;
}

// Run main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
`;
}
