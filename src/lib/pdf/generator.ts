import PDFDocument from 'pdfkit';
import { getDictionary, SupportedLanguage } from '../i18n';

export interface PdfEstimateData {
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  location: string;
  builtAreaM2: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  quality: string;
  climateSystem: string;
  domotics: boolean;
  pool: string;
  exteriorParking: number;
  exteriorGardenM2: number;
  projectLicences: boolean;
  centralTotal: number;
  lowEstimate: number;
  highEstimate: number;
  pricePerM2: number;
  language: SupportedLanguage;
  lineItems: Array<{
    key: string;
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    customerTotal: number;
  }>;
  createdAt: Date;
}

export async function generateEstimatePdf(data: PdfEstimateData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 45,
        info: {
          Title: `MallorcaQuotes Estimate ${data.reference}`,
          Author: 'MallorcaQuotes.com',
          Subject: 'Indicative Construction Estimate Dossier',
        },
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const dict = getDictionary(data.language);

      const formatEuro = (amount: number) => {
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        }).format(amount);
      };

      // Palette
      const darkColor = '#1C1F1E';
      const oliveColor = '#4A5B47';
      const mutedColor = '#666666';
      const stoneBg = '#F4EFEA';
      const borderColor = '#DDD5C8';

      // --- HEADER ---
      doc.rect(45, 45, 505, 75).fill(stoneBg);

      doc.fillColor(darkColor).fontSize(20).font('Helvetica-Bold').text('MallorcaQuotes', 65, 60);
      doc.fillColor(oliveColor).fontSize(9).font('Helvetica').text('INDEPENDENT CONSTRUCTION COST ESTIMATION', 65, 84);

      doc.fillColor(mutedColor).fontSize(8).font('Helvetica')
        .text(`Ref: #${data.reference}`, 380, 62, { align: 'right', width: 150 })
        .text(`Date: ${new Date(data.createdAt).toLocaleDateString(data.language === 'de' ? 'de-DE' : data.language === 'es' ? 'es-ES' : 'en-GB')}`, 380, 75, { align: 'right', width: 150 })
        .text('Mallorca, Balearic Islands', 380, 88, { align: 'right', width: 150 });

      doc.y = 135;

      // --- CLIENT & PROJECT OVERVIEW ---
      doc.fillColor(darkColor).fontSize(12).font('Helvetica-Bold').text(
        data.language === 'es' ? 'RESUMEN DEL PROYECTO' : data.language === 'de' ? 'PROJEKTÜBERSICHT' : 'PROJECT OVERVIEW',
        45,
        doc.y
      );
      doc.moveDown(0.4);

      // Two column details
      const colTop = doc.y;
      doc.fillColor(mutedColor).fontSize(9).font('Helvetica');

      // Left col: Client details
      doc.text(`${data.language === 'es' ? 'Cliente' : data.language === 'de' ? 'Bauherr' : 'Client'}: `, 45, colTop, { continued: true })
        .font('Helvetica-Bold').fillColor(darkColor).text(data.customerName);
      doc.font('Helvetica').fillColor(mutedColor)
        .text(`Email: ${data.email}`)
        .text(`${data.language === 'es' ? 'Ubicación' : data.language === 'de' ? 'Standort' : 'Location'}: ${data.location}, Mallorca`);

      // Right col: Project Specs
      doc.font('Helvetica').fillColor(mutedColor)
        .text(`${data.language === 'es' ? 'Superficie' : data.language === 'de' ? 'Wohnfläche' : 'Built-up Area'}: `, 300, colTop, { continued: true })
        .font('Helvetica-Bold').fillColor(darkColor).text(`${data.builtAreaM2} m² (${data.floors} ${data.language === 'es' ? 'plantas' : data.language === 'de' ? 'Etagen' : 'floors'})`);
      doc.font('Helvetica').fillColor(mutedColor)
        .text(`${data.language === 'es' ? 'Distribución' : data.language === 'de' ? 'Aufteilung' : 'Layout'}: ${data.bedrooms} ${data.language === 'es' ? 'hab.' : 'bed'} | ${data.bathrooms} ${data.language === 'es' ? 'baños' : 'bath'}`)
        .text(`${data.language === 'es' ? 'Calidad' : data.language === 'de' ? 'Standard' : 'Quality'}: ${data.quality} | ${data.language === 'es' ? 'Piscina' : 'Pool'}: ${data.pool}`, 300);

      doc.y = colTop + 55;

      // --- MAIN ESTIMATE RANGE BANNER ---
      doc.rect(45, doc.y, 505, 55).fill(oliveColor);
      doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica')
        .text(
          data.language === 'es' ? 'RANGO ESTIMADO DE CONSTRUCCIÓN (ORIENTATIVO ±5%)' : data.language === 'de' ? 'GESCHÄTZTER BAUKOSTENRAHMEN (RICHTWERT ±5%)' : 'ESTIMATED CONSTRUCTION COST RANGE (±5% INDICATIVE)',
          55,
          doc.y + 12,
          { align: 'center', width: 485 }
        );
      doc.fillColor('#FFFFFF').fontSize(18).font('Helvetica-Bold')
        .text(`${formatEuro(data.lowEstimate)} – ${formatEuro(data.highEstimate)}`, 55, doc.y + 28, { align: 'center', width: 485 });

      doc.y += 70;

      // --- ITEMIZED BREAKDOWN TABLE ---
      doc.fillColor(darkColor).fontSize(11).font('Helvetica-Bold').text(
        data.language === 'es' ? 'DESGLOSE DE PARTIDAS DE OBRA' : data.language === 'de' ? 'AUFSTELLUNG DER BAUKOSTEN-GEWERKE' : 'ITEMIZED CONSTRUCTION COST BREAKDOWN',
        45,
        doc.y
      );
      doc.moveDown(0.3);

      // Table Header
      const tableX = 45;
      const colWidths = { name: 260, qty: 70, unit: 65, total: 110 };
      const tableHeadY = doc.y;

      doc.rect(tableX, tableHeadY, 505, 18).fill('#E8E2D9');
      doc.fillColor(darkColor).fontSize(8).font('Helvetica-Bold');
      doc.text(data.language === 'es' ? 'PARTIDA' : data.language === 'de' ? 'GEWERK' : 'CONSTRUCTION TRADE', tableX + 8, tableHeadY + 5);
      doc.text(data.language === 'es' ? 'CANTIDAD' : data.language === 'de' ? 'MENGE' : 'QUANTITY', tableX + colWidths.name, tableHeadY + 5, { width: colWidths.qty, align: 'right' });
      doc.text(data.language === 'es' ? 'UNIDAD' : data.language === 'de' ? 'EINHEIT' : 'UNIT', tableX + colWidths.name + colWidths.qty, tableHeadY + 5, { width: colWidths.unit, align: 'center' });
      doc.text(data.language === 'es' ? 'TOTAL ESTIMADO' : data.language === 'de' ? 'GESAMTBETRAG' : 'ESTIMATED TOTAL', tableX + colWidths.name + colWidths.qty + colWidths.unit, tableHeadY + 5, { width: colWidths.total - 10, align: 'right' });

      doc.y = tableHeadY + 20;

      // Table Rows
      doc.font('Helvetica').fontSize(7.5);
      let isEven = false;
      let currentY = doc.y;

      for (const item of data.lineItems) {
        // Page break safety check
        if (currentY > 730) {
          doc.addPage();
          currentY = 45;
        }

        if (isEven) {
          doc.rect(tableX, currentY, 505, 14).fill('#FBF9F6');
        }
        isEven = !isEven;

        doc.fillColor(darkColor);
        doc.text(item.name, tableX + 8, currentY + 3, { width: colWidths.name - 10 });
        doc.text(item.quantity.toString(), tableX + colWidths.name, currentY + 3, { width: colWidths.qty, align: 'right' });
        doc.text(item.unit, tableX + colWidths.name + colWidths.qty, currentY + 3, { width: colWidths.unit, align: 'center' });
        doc.font('Helvetica-Bold').text(formatEuro(item.customerTotal), tableX + colWidths.name + colWidths.qty + colWidths.unit, currentY + 3, { width: colWidths.total - 10, align: 'right' }).font('Helvetica');

        currentY += 14;
      }

      // Total Line
      doc.rect(tableX, currentY, 505, 20).fill('#E8E2D9');
      doc.fillColor(darkColor).fontSize(8.5).font('Helvetica-Bold');
      doc.text(data.language === 'es' ? 'TOTAL CENTRAL ORIENTATIVO' : data.language === 'de' ? 'MITTLERER RICHTWERT GESAMT' : 'CENTRAL INDICATIVE ESTIMATE', tableX + 8, currentY + 6);
      doc.text(formatEuro(data.centralTotal), tableX + colWidths.name + colWidths.qty + colWidths.unit, currentY + 6, { width: colWidths.total - 10, align: 'right' });

      currentY += 28;
      doc.y = currentY;

      // --- LEGAL & TECHNICAL DISCLAIMER ---
      if (doc.y > 690) {
        doc.addPage();
      }

      doc.rect(45, doc.y, 505, 60).stroke(borderColor);
      doc.fillColor(oliveColor).fontSize(7.5).font('Helvetica-Bold')
        .text(dict.disclaimer.title.toUpperCase(), 55, doc.y + 8);
      doc.fillColor(mutedColor).fontSize(6.5).font('Helvetica')
        .text(dict.disclaimer.text, 55, doc.y + 20, { width: 485, lineGap: 1.5 });

      // Footer notice
      doc.fillColor(mutedColor).fontSize(6.5)
        .text(
          'MallorcaQuotes.com • Independent Estimation Platform • info@mallorcaquotes.com • Palma de Mallorca, Spain',
          45,
          775,
          { align: 'center', width: 505 }
        );

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}
