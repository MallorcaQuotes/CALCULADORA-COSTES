import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth/admin';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { leadId: string } }
) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { leadId } = params;

  try {
    const lead = await db.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead || !lead.plansFileUrl) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), 'storage', 'uploads', lead.plansFileUrl);
    const fileBuffer = await fs.readFile(filePath);

    const ext = path.extname(lead.plansFileUrl).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';

    const filename = lead.plansFileName || `plano_${lead.reference}${ext}`;

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Error al descargar archivo' }, { status: 500 });
  }
}
