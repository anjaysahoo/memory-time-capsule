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
  const message = [
    \`To: \${to}\`,
    \`Subject: \${subject}\`,
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
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">🎉 Your Time Capsule is Unlocked!</h1>
  </div>
  <div style="padding: 30px; background: #f9f9f9;">
    <p>Hi,</p>
    <p>Your time capsule from <strong>\${capsule.senderName}</strong> is now unlocked!</p>
    <h2>\${capsule.title}</h2>
    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-weight: bold;">Your PIN:</p>
      <p style="font-size: 32px; text-align: center; letter-spacing: 8px; margin: 10px 0;">\${pin}</p>
    </div>
    <p><a href="\${magicLink}" style="background: #f5576c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Open Time Capsule</a></p>
  </div>
</body>
</html>
  \`;
}

function generateUnlockEmailText(capsule, pin, magicLink, unlockDate) {
  return \`
Your Time Capsule is Unlocked!

Your time capsule from \${capsule.senderName} is now unlocked: "\${capsule.title}"

Your PIN: \${pin}

Open your capsule: \${magicLink}
  \`;
}

function generateSenderNotificationHtml(capsule, whatsappLink) {
  return \`
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">✅ Capsule Unlocked</h1>
  </div>
  <div style="padding: 30px; background: #f9f9f9;">
    <p>Hi \${capsule.senderName},</p>
    <p>Your time capsule has been unlocked and delivered to <strong>\${capsule.recipientEmail}</strong>.</p>
    <h2>\${capsule.title}</h2>
    <p><a href="\${whatsappLink}" style="background: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">📱 Send WhatsApp Reminder</a></p>
  </div>
</body>
</html>
  \`;
}

function generateSenderNotificationText(capsule, whatsappLink) {
  return \`
Your Time Capsule Has Unlocked

Your time capsule "\${capsule.title}" has been unlocked and delivered to \${capsule.recipientEmail}.

Send WhatsApp reminder: \${whatsappLink}
  \`;
}

// Run main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
`;
}

