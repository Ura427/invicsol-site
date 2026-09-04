/**
 * Sends an instant lead notification to the business via the Telegram Bot API.
 * Free, reliable, no email-deliverability problems. Disabled (no-ops, returns
 * false) when the bot token/chat id env vars are unset, so local development
 * doesn't require Telegram credentials to exercise the rest of the lead flow.
 */
export async function sendTelegramNotification(text: string): Promise<boolean> {
  const token = process.env['TELEGRAM_BOT_TOKEN'];
  const chatId = process.env['TELEGRAM_CHAT_ID'];
  if (!token || !chatId) return false;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });

  return response.ok;
}
