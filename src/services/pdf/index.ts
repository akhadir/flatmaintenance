/* eslint-disable no-await-in-loop */
// eslint-disable-next-line import/no-extraneous-dependencies
import { PDFDocument } from 'pdf-lib';
import PDFJS from 'pdfjs-dist';

export function getPDFImageDimension(pdfUrl: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
        PDFJS.getDocument(pdfUrl).promise.then(async (pdf) => {
            const page = await pdf.getPage(1);
            // Get the content of the first page
            const ops = await page.getOperatorList();
            const fns = ops.fnArray;
            const args = ops.argsArray;
            // Find the first image on the page
            const imageIndex = fns.findIndex((op) => op === PDFJS.OPS.paintImageXObject);
            if (imageIndex < -1) {
                reject(new Error('IMAGE NOT FOUND INSIDE PDF'));
            }
            const imgKey = args[imageIndex][0];
            page.objs.get(imgKey, (img: any) => {
                const { width, height } = img;
                resolve({ width, height });
            });
        });
    });
}

export async function splitPdfPagesFromUrl(pdfUrl: string, callback: (blod: Blob) => void) {
    // Fetch the PDF from the URL
    const response = await fetch(pdfUrl);
    const pdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    // Clear any existing links
    for (let i = 0; i < totalPages; i += 1) {
        createPDFFromPage(pdfDoc, i, callback);
        // // Create a download link for each split page
        // const link = document.createElement('a');
        // link.href = URL.createObjectURL(blob);
        // link.download = `page_${i + 1}.pdf`;
        // link.textContent = `Download Page ${i + 1}`;
        // link.style.display = 'block';

        // if (downloadLinksContainer) downloadLinksContainer.appendChild(link);
    }
}

export default { extractFirstImage: getPDFImageDimension };
async function createPDFFromPage(pdfDoc: PDFDocument, i: number, callback: (blod: Blob) => void) {
    const newPdfDoc = await PDFDocument.create();
    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
    newPdfDoc.addPage(copiedPage);

    // Save each page as a separate PDF blob
    const newPdfBytes = await newPdfDoc.save();
    const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
    callback(blob);
}
