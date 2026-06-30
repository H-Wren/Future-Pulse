/**
 * Client-side PDF text extraction using pdfjs-dist.
 * Worker is bundled locally — no CDN dependency, works without VPN.
 */
import * as pdfjs from 'pdfjs-dist';

// Bundle the worker with Vite instead of loading from CDN
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export async function extractTextFromPDF(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const texts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    texts.push(pageText);
  }

  return texts.join('\n\n');
}
