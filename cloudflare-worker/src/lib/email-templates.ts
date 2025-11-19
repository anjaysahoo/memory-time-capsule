/**
 * Email template generators
 */

export interface CapsuleEmailData {
    recipientEmail: string;
    recipientName?: string;
    senderName: string;
    senderEmail: string;
    capsuleTitle: string;
    unlockDate: string;
    magicLink: string;
    pin?: string;
    whatsappLink?: string;
}

/**
 * Generate creation email (sent to recipient when capsule is created)
 */
export function generateCreationEmail(
    data: CapsuleEmailData
): { html: string; text: string } {
    const recipientName = data.recipientName || data.recipientEmail;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Time Capsule from ${data.senderName}</title>
</head>
<body style="margin:0; padding:32px 16px; background:#000; color:#f5f5f5; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:640px; margin:0 auto;">
    <header style="text-align:center; margin-bottom:24px;">
      <h1 style="margin:0 0 8px; font-size:28px; font-weight:700; letter-spacing:0.03em;">
        Send Messages to the Future
      </h1>
      <p style="margin:0; font-size:14px; opacity:0.7;">
        A memory has been quietly sealed for you.
      </p>
    </header>

    <main style="background:#050509; border:1px solid #1f2933; border-radius:14px; padding:24px 20px;">
      <p style="margin:0 0 12px; font-size:16px; line-height:1.7;">
        Hi ${recipientName},
      </p>

      <p style="margin:0 0 12px; font-size:16px; line-height:1.7;">
        <em>${data.senderName}</em> has created a time capsule for you. It will open at the perfect moment in time:
      </p>

      <section style="margin:18px 0 20px; padding:18px 16px; border-radius:10px; border:1px solid #273549; background:#020306;">
        <div style="font-size:13px; text-transform:uppercase; letter-spacing:0.15em; opacity:0.7; margin-bottom:6px;">
          Capsule
        </div>
        <h2 style="margin:0 0 6px; font-size:20px; font-weight:600;">
          ${data.capsuleTitle}
        </h2>
        <p style="margin:0; font-size:15px; line-height:1.6;">
          🗓 <span style="opacity:0.8;">Unlocks on</span>
          <em style="font-style:italic;"> ${data.unlockDate}</em>
        </p>
      </section>

      <p style="margin:0 0 20px; font-size:15px; line-height:1.7; opacity:0.9;">
        Until then, your message is safely preserved in the dark of space. You’ll get another email as soon as it unlocks.
      </p>

      <div style="text-align:center; margin:26px 0 10px;">
        <a
          href="${data.magicLink}"
          style="
            display:inline-block;
            padding:12px 28px;
            border-radius:999px;
            background:#f5f5f5;
            color:#000;
            text-decoration:none;
            font-size:15px;
            font-weight:600;
          "
        >
          View Countdown
        </a>
      </div>

      <p style="margin:24px 0 0; font-size:12px; line-height:1.6; opacity:0.6;">
        This is an automated message from <em>Memory Time Capsule</em>.  
        Created by <em>${data.senderName}</em> (${data.senderEmail}).
      </p>
    </main>
  </div>
</body>
</html>
  `.trim();

    const text = `
Time Capsule from ${data.senderName}

Hi ${recipientName},

${data.senderName} has created a time capsule for you.

Title: "${data.capsuleTitle}"
Unlocks on: ${data.unlockDate}

You can view the live countdown here:
${data.magicLink}

—
This is an automated message from Memory Time Capsule.
Created by ${data.senderName} (${data.senderEmail}).
  `.trim();

    return { html, text };
}

/**
 * Generate unlock email (sent to recipient when capsule unlocks)
 */
export function generateUnlockEmail(
    data: CapsuleEmailData
): { html: string; text: string } {
    const recipientName = data.recipientName || data.recipientEmail;
    const pin = data.pin || '0000';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Time Capsule is Unlocked</title>
</head>
<body style="margin:0; padding:32px 16px; background:#000; color:#f5f5f5; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:640px; margin:0 auto;">
    <header style="text-align:center; margin-bottom:24px;">
      <h1 style="margin:0 0 8px; font-size:28px; font-weight:700; letter-spacing:0.03em;">
        Your Time Capsule is Unlocked
      </h1>
      <p style="margin:0; font-size:14px; opacity:0.7;">
        A message from the past has arrived.
      </p>
    </header>

    <main style="background:#050509; border:1px solid #1f2933; border-radius:14px; padding:24px 20px;">
      <p style="margin:0 0 12px; font-size:16px; line-height:1.7;">
        Hi ${recipientName},
      </p>

      <p style="margin:0 0 12px; font-size:16px; line-height:1.7;">
        The capsule <em>"${data.capsuleTitle}"</em> from <em>${data.senderName}</em> is now open.
      </p>

      <section style="margin:18px 0 20px; padding:18px 16px; border-radius:10px; border:1px solid #273549; background:#020306;">
        <div style="font-size:13px; text-transform:uppercase; letter-spacing:0.15em; opacity:0.7; margin-bottom:6px;">
          Access Pin
        </div>
        <p style="margin:4px 0 0; font-size:26px; font-weight:600; letter-spacing:0.25em; text-align:center;">
          ${pin}
        </p>
      </section>

      <div style="text-align:center; margin:26px 0 10px;">
        <a
          href="${data.magicLink}"
          style="
            display:inline-block;
            padding:12px 28px;
            border-radius:999px;
            background:#f5f5f5;
            color:#000;
            text-decoration:none;
            font-size:15px;
            font-weight:600;
          "
        >
          Open Time Capsule
        </a>
      </div>

      ${
        data.whatsappLink
            ? `
      <section style="margin-top:20px; padding:14px 12px; border-radius:10px; border:1px solid #1d3b2a; background:#02130a;">
        <p style="margin:0 0 8px; font-size:14px; line-height:1.6; opacity:0.9;">
          💬 <em>Optional:</em> keep this moment close by opening it on WhatsApp.
        </p>
        <div style="text-align:center; margin-top:4px;">
          <a
            href="${data.whatsappLink}"
            style="
              display:inline-block;
              padding:10px 22px;
              border-radius:999px;
              background:#25d366;
              color:#000;
              text-decoration:none;
              font-size:14px;
              font-weight:600;
            "
          >
            Open in WhatsApp
          </a>
        </div>
      </section>
      `
            : ''
    }

      <p style="margin:24px 0 0; font-size:12px; line-height:1.6; opacity:0.6;">
        This is an automated message from <em>Memory Time Capsule</em>.  
        Capsule created by <em>${data.senderName}</em> (${data.senderEmail}).
      </p>
    </main>
  </div>
</body>
</html>
  `.trim();

    const text = `
Your Time Capsule is Unlocked

Hi ${recipientName},

The capsule "${data.capsuleTitle}" from ${data.senderName} is now open.

PIN: ${pin}
Open your capsule: ${data.magicLink}
${data.whatsappLink ? `WhatsApp quick open: ${data.whatsappLink}` : ''}

—
This is an automated message from Memory Time Capsule.
Capsule created by ${data.senderName} (${data.senderEmail}).
  `.trim();

    return { html, text };
}
