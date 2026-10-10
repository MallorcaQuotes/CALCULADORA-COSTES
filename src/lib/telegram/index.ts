export interface TelegramLeadNotification {
  reference: string;
  language: string;
  nationality: string;
  location: string;
  plotOwned: string;
  builtAreaM2: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  quality: string;
  pool: string;
  lowEstimate: number;
  highEstimate: number;
  customerName: string;
  email: string;
  phone: string;
  adminLeadUrl: string;
}

export async function sendTelegramLeadNotification(data: TelegramLeadNotification): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const formatEuro = (num: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const messageText = `🔔 *NUEVO LEAD EN MALLORCAQUOTES*

*Referencia:* #${data.reference}
*Idioma web:* ${data.language.toUpperCase()}
*Nacionalidad:* ${data.nationality}
*Ubicación:* ${data.location}
*Solar:* ${data.plotOwned}

*Superficie:* ${data.builtAreaM2} m²
*Plantas:* ${data.floors}
*Habitaciones:* ${data.bedrooms} | *Baños:* ${data.bathrooms}
*Calidad:* ${data.quality}
*Piscina:* ${data.pool}

*Estimación Orientativa:*
${formatEuro(data.lowEstimate)} – ${formatEuro(data.highEstimate)}

*Cliente:*
${data.customerName}
${data.email}
${data.phone}

*Estado:*
EN REVISIÓN

🔗 [Revisar y Aprobar Presupuesto en Admin](${data.adminLeadUrl})`;

  if (!token || !chatId || token === 'your_telegram_bot_token') {
    console.log('[Telegram Notification (Simulation)] Credentials not configured. Message would be:\n', messageText);
    return true; // Graceful simulation without error
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🔍 Ver y Gestionar en Admin',
                url: data.adminLeadUrl,
              },
            ],
          ],
        },
      }),
    });

    const json = await res.json();
    if (!res.ok || !json.ok) {
      console.error('[Telegram Error]', json);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Telegram Network Error]', error);
    return false;
  }
}
