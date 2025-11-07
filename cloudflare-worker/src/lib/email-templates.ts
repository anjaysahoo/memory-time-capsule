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
export function generateCreationEmail(data: CapsuleEmailData): { html: string; text: string } {
  const recipientName = data.recipientName || data.recipientEmail;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Time Capsule from ${data.senderName}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎁 Time Capsule Sealed</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hi ${recipientName},</p>
    
    <p style="font-size: 16px;">
      <strong>${data.senderName}</strong> has sent you a special time capsule that will unlock on:
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
      <h2 style="margin: 0 0 10px 0; color: #667eea; font-size: 20px;">${data.capsuleTitle}</h2>
      <p style="margin: 0; font-size: 18px; color: #666;">
        🗓️ Unlocks: <strong>${data.unlockDate}</strong>
      </p>
    </div>
    
    <p style="font-size: 16px;">
      This capsule is currently sealed and waiting for the special moment. You'll receive another email with access details when it unlocks.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.magicLink}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
        View Countdown
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      This is an automated message from Memory Time Capsule. The capsule was created by ${data.senderName} (${data.senderEmail}).
    </p>
  </div>
</body>
</html>
  `.trim();

  const text = `
Time Capsule from ${data.senderName}

Hi ${recipientName},

${data.senderName} has sent you a special time capsule: "${data.capsuleTitle}"

Unlocks: ${data.unlockDate}

This capsule is currently sealed. You'll receive another email with access details when it unlocks.

View countdown: ${data.magicLink}

---
This is an automated message from Memory Time Capsule.
The capsule was created by ${data.senderName} (${data.senderEmail}).
  `.trim();

  return { html, text };
}

/**
 * Generate unlock email (sent to recipient when capsule unlocks)
 */
export function generateUnlockEmail(data: CapsuleEmailData): { html: string; text: string } {
  const recipientName = data.recipientName || data.recipientEmail;
  const pin = data.pin || '0000';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Time Capsule is Unlocked!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Time Capsule Unlocked!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hi ${recipientName},</p>
    
    <p style="font-size: 16px;">
      The time capsule "<strong>${data.capsuleTitle}</strong>" from <strong>${data.senderName}</strong> is now unlocked!
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
      <h2 style="margin: 0 0 10px 0; color: #667eea; font-size: 20px;">Access Your Capsule</h2>
      <p style="margin: 10px 0; font-size: 16px;">
        🔑 PIN Code: <strong style="font-size: 24px; color: #667eea;">${pin}</strong>
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.magicLink}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
        Open Time Capsule
      </a>
    </div>
    
    ${data.whatsappLink ? `
    <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #2e7d32;">
        💬 <strong>Quick Access:</strong> Click here to open in WhatsApp
      </p>
      <div style="text-align: center; margin: 10px 0;">
        <a href="${data.whatsappLink}" style="background: #25d366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 14px; display: inline-block;">
          Open in WhatsApp
        </a>
      </div>
    </div>
    ` : ''}
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      This is an automated message from Memory Time Capsule. The capsule was created by ${data.senderName} (${data.senderEmail}).
    </p>
  </div>
</body>
</html>
  `.trim();

  const text = `
Your Time Capsule is Unlocked!

Hi ${recipientName},

The time capsule "${data.capsuleTitle}" from ${data.senderName} is now unlocked!

Access Your Capsule:
PIN Code: ${pin}

Open your capsule: ${data.magicLink}

${data.whatsappLink ? `Quick Access via WhatsApp: ${data.whatsappLink}` : ''}

---
This is an automated message from Memory Time Capsule.
The capsule was created by ${data.senderName} (${data.senderEmail}).
  `.trim();

  return { html, text };
}

