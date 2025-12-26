/**
 * WhatsApp Business Cloud API helper functions
 */

interface WhatsAppConfig {
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  verifyToken: string;
}

export interface WhatsAppMessage {
  from: string; // phone number
  text: string;
  messageId: string;
  timestamp: string;
}

/**
 * Send a text message via WhatsApp Business Cloud API
 */
export async function sendWhatsAppTextMessage(
  to: string,
  text: string,
  config: WhatsAppConfig
): Promise<void> {
  const url = `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: {
        body: text,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WhatsApp API error: ${error}`);
  }
}

/**
 * Verify webhook challenge (for GET requests)
 */
export function verifyWhatsAppWebhook(
  mode: string | null,
  token: string | null,
  challenge: string | null,
  verifyToken: string
): string | null {
  if (mode === 'subscribe' && token === verifyToken) {
    return challenge || null;
  }
  return null;
}

/**
 * Parse incoming webhook payload
 */
export function parseWhatsAppWebhook(body: any): WhatsAppMessage[] {
  const messages: WhatsAppMessage[] = [];

  if (body.entry) {
    for (const entry of body.entry) {
      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.value?.messages) {
            for (const message of change.value.messages) {
              if (message.type === 'text') {
                messages.push({
                  from: message.from,
                  text: message.text.body,
                  messageId: message.id,
                  timestamp: message.timestamp,
                });
              }
            }
          }
        }
      }
    }
  }

  return messages;
}

