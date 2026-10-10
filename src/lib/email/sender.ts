import nodemailer from 'nodemailer';
import { SupportedLanguage } from '../i18n';

export interface SendEstimateEmailParams {
  recipientEmail: string;
  customerName: string;
  reference: string;
  location: string;
  lowEstimate: number;
  highEstimate: number;
  language: SupportedLanguage;
  pdfBuffer: Buffer;
}

export async function sendEstimateEmail(params: SendEstimateEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const {
    recipientEmail,
    customerName,
    reference,
    location,
    lowEstimate,
    highEstimate,
    language,
    pdfBuffer,
  } = params;

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const rangeStr = `${formatEuro(lowEstimate)} – ${formatEuro(highEstimate)}`;

  // Localized email subjects & body
  let subject = `Your Construction Cost Estimate for Mallorca — #${reference}`;
  let greeting = `Dear ${customerName},`;
  let intro = `Thank you for consulting MallorcaQuotes. Our engineering model has analyzed your project specifications in ${location}, Mallorca.`;
  let rangeLabel = 'Estimated Construction Cost Range (±5% Indicative):';
  let detailsText = 'Please find attached your comprehensive architectural estimate dossier, including the full 21-trade breakdown (Excavation, Structure, MEP, Glazing, Luxury Finishes and Licences).';
  let disclaimerText = 'Please note that this document is an independent indicative cost estimation and does not constitute a formal binding contractor quotation.';
  let signoff = 'Best regards,\nThe MallorcaQuotes Engineering Team\nhttps://www.mallorcaquotes.com';

  if (language === 'es') {
    subject = `Tu Presupuesto Estimativo de Construcción en Mallorca — #${reference}`;
    greeting = `Estimado/a ${customerName},`;
    intro = `Gracias por consultar MallorcaQuotes. Nuestro modelo técnico ha evaluado los parámetros de tu proyecto en ${location}, Mallorca.`;
    rangeLabel = 'Rango Estimado de Construcción (Orientativo ±5%):';
    detailsText = 'Adjunto encontrarás tu dossier completo de estimación arquitectónica, con el desglose detallado de las 21 partidas de obra (Excavación, Estructura, Climatización, Cerramientos y Acabados).';
    disclaimerText = 'Ten en cuenta que este documento representa una estimación económica orientativa y no constituye una oferta contractual vinculante.';
    signoff = 'Atentamente,\nEl equipo técnico de MallorcaQuotes\nhttps://www.mallorcaquotes.com';
  } else if (language === 'de') {
    subject = `Ihre Baukostenschätzung für Mallorca — #${reference}`;
    greeting = `Sehr geehrte(r) ${customerName},`;
    intro = `Vielen Dank für Ihre Anfrage bei MallorcaQuotes. Unser Berechnungsmodell hat Ihre Projektangaben für ${location}, Mallorca, ausgewertet.`;
    rangeLabel = 'Geschätzter Baukostenrahmen (Richtwert ±5%):';
    detailsText = 'Im Anhang finden Sie Ihr vollständiges Baukosten-Dossier mit der detaillierten Aufstellung über alle 21 Gewerke (Rohbau, Haustechnik, Verglasung und Ausbauten).';
    disclaimerText = 'Bitte beachten Sie, dass es sich um eine unabhängige Richtwert-Schätzung handelt und kein verbindliches Bauangebot darstellt.';
    signoff = 'Mit freundlichen Grüßen,\nIhr Team von MallorcaQuotes.com\nhttps://www.mallorcaquotes.com';
  }

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1C1F1E; line-height: 1.6; background-color: #FAF8F5; padding: 24px; border-radius: 12px; border: 1px solid #DDD5C8;">
      <div style="border-bottom: 2px solid #4A5B47; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #1C1F1E; font-size: 22px;">Mallorca<span style="color: #666;">Quotes</span></h2>
        <span style="font-size: 11px; text-transform: uppercase; color: #4A5B47; letter-spacing: 1px; font-weight: bold;">Independent Construction Estimation</span>
      </div>

      <p style="font-size: 14px; margin-bottom: 16px;">${greeting}</p>
      <p style="font-size: 14px; margin-bottom: 20px;">${intro}</p>

      <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; border: 1px solid #DDD5C8; margin-bottom: 20px; text-align: center;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; font-weight: bold;">${rangeLabel}</div>
        <div style="font-size: 26px; font-weight: bold; color: #1C1F1E; margin-top: 6px;">${rangeStr}</div>
      </div>

      <p style="font-size: 13px; margin-bottom: 16px;">${detailsText}</p>

      <div style="background-color: #E8E2D9; padding: 12px 16px; border-radius: 6px; font-size: 11px; color: #555; margin-bottom: 24px;">
        <strong>Notice:</strong> ${disclaimerText}
      </div>

      <p style="font-size: 13px; color: #444; white-space: pre-line; border-top: 1px solid #DDD5C8; padding-top: 16px;">${signoff}</p>
    </div>
  `;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || host === 'smtp.example.com' || host === 'localhost') {
    console.log(`[Email Simulation] SMTP not configured. Simulating delivery to ${recipientEmail} for ref #${reference}`);
    return { success: true, messageId: `mock-${Date.now()}` };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: user ? { user, pass } : undefined,
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'MallorcaQuotes <info@mallorcaquotes.com>',
      to: recipientEmail,
      subject,
      text: `${greeting}\n\n${intro}\n\n${rangeLabel} ${rangeStr}\n\n${detailsText}\n\n${disclaimerText}\n\n${signoff}`,
      html: htmlBody,
      attachments: [
        {
          filename: `MallorcaQuotes_Estimate_${reference}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('[Email Send Error]', err);
    return { success: false, error: err.message };
  }
}
