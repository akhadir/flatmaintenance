import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import { getConfig } from '..';

// Google Drive API key and file ID of the public PDF

// Function to download a PDF file using Google Drive API key
async function downloadPdfFile(fileId: string): Promise<Uint8Array> {
    const { googleAPIKey: apiKey } = getConfig();
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return new Uint8Array(response.data);
}

// Function to split PDF pages and save them locally
export default async function splitAndSaveLocally(fileId: string) {
    // Download the PDF file
    const pdfBytes = await downloadPdfFile(fileId);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();
    const promises: Promise<void>[] = [];
    for (let i = 0; i < totalPages; i += 1) {
        promises.push(saveDoc(pdfDoc, i));
    }
    console.log('All PDF pages have been split and saved locally.');
    return Promise.all(promises);
}

async function saveDoc(pdfDoc: PDFDocument, i: number) {
    const newPdfDoc = await PDFDocument.create();
    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
    newPdfDoc.addPage(copiedPage);
    // Save each page as a separate PDF
    const newPdfBytes = await newPdfDoc.save();
    const outputPath = `page_${i + 1}.pdf`;
    fs.writeFileSync(outputPath, newPdfBytes);
    console.log(`Page ${i + 1} saved locally as ${outputPath}`);
}

async function uploadToDrive(fileData: Uint8Array, fileName: string, DRIVE_FOLDER_ID: string, oauth2Client: any) {
    const driveApiUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    const accessToken = (await oauth2Client.getAccessToken()).token;

    const metadata = {
        name: fileName,
        parents: [DRIVE_FOLDER_ID], // Specify the target folder ID
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', new Blob([fileData], { type: 'application/pdf' }));

    // Make an Axios POST request to upload the file
    await axios.post(driveApiUrl, formData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}
