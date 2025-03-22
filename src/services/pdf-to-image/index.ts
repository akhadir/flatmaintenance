import { PDFDocument, PDFName } from 'pdf-lib';
import html2canvas from 'html2canvas';

class PDFToImagesConverter {
    async pdfDataUriToCanvas(pdfBlobUrl: string): Promise<string | undefined> {
        const promise = new Promise<string | undefined>((resolve) => {
            const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
            iframe.onload = async () => {
                const iframeDocument = iframe.contentWindow?.document;
                if (iframeDocument?.body) {
                    const canvas = await html2canvas(iframeDocument.body);
                    const imageData = canvas.toDataURL('image/png');
                    // Convert canvas to image
                    const previewImage = document.getElementById('cap-image');
                    if (previewImage) {
                        previewImage.setAttribute('src', imageData);
                    }
                    resolve(imageData);
                } else {
                    resolve(undefined);
                }
                iframe.className = '';
            };
            iframe.className = 'active';
            iframe.src = pdfBlobUrl;
        });
        return promise;
    }

    async convert(url: string) {
        const outputPath = '';
        const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        // // const pages = pdf.getPages();
        const newPdf = await PDFDocument.create();
        const [firstPage] = await newPdf.copyPages(pdfDoc, [0]);
        // newPdf.addPage(firstPage);
        // const base64Pdf = await newPdf.saveAsBase64({ dataUri: true });
        // const blocPdfURL = this.dataURItoBlobURL(base64Pdf);
        // const base64Image = await this.pdfDataUriToCanvas(blocPdfURL);

        // @ts-ignore
        const { dict } = firstPage.node;
        const resources = dict.get(PDFName.of('Resources'));

        const xObject = resources.get(PDFName.of('XObject'));
        if (!xObject) {
            console.log('No XObject resources found on this page.');
            return [];
        }

        const extractedImages: any[] = [];
        Object.entries(xObject.dict).forEach(([name, ref]: any) => {
            const xObj: any = pdfDoc.context.lookup(ref);
            // Check if the XObject is an image
            if (xObj && xObj.dict && xObj.dict.get(PDFName.of('Subtype'))?.toString() === '/Image') {
            // Get image data
                const imageData = xObj.dict.context.lookupMaybe(xObj.dict.dataStart, (PDF_KEYS: any) =>
                    typeof PDF_KEYS === 'object' ? PDF_KEYS : null);
                // Get image properties
                const bitsPerComponent = xObj.dict.get(PDFName.of('BitsPerComponent'))?.toString();
                const colorSpace = xObj.dict.get(PDFName.of('ColorSpace'))?.toString();
                const filter = xObj.dict.get(PDFName.of('Filter'))?.toString();
                // Determine file extension based on filter
                let extension = '.raw';
                if (filter) {
                    if (filter.includes('/DCTDecode')) {
                        extension = '.jpg';
                    } else if (filter.includes('/FlateDecode')) {
                        extension = '.png'; // Note: This is simplified, FlateDecode doesn't directly map to PNG
                    } else if (filter.includes('/JBIG2Decode')) {
                        extension = '.jbig2';
                    } else if (filter.includes('/JPXDecode')) {
                        extension = '.jp2';
                    }
                }
                //
                if (imageData) {
                    extractedImages.push({
                        name,
                        path: outputPath,
                        properties: {
                            bitsPerComponent,
                            colorSpace,
                            filter,
                        },
                    });
                    console.log(`Extracted image: ${outputPath}`);
                }
            }
        });
        return extractedImages;
    }

    base64ToUint8Array(base64: string) {
        const binaryString = atob(base64);
        const { length } = binaryString;
        const uint8Array = new Uint8Array(length);
        for (let i = 0; i < length; i += 1) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }
        return uint8Array;
    }

    uint8ArrayToBase64(uint8Array: Uint8Array): string {
        let binary = '';
        const len = uint8Array.length;
        for (let i = 0; i < len; i += 1) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        return btoa(binary);
    }

    uint8ArrayToBase64Image(uint8Array: Uint8Array, mimeType: string = 'image/png'): string {
        const base64String = this.uint8ArrayToBase64(uint8Array);
        return `data:${mimeType};base64,${base64String}`;
    }

    dataURItoBlobURL(dataURI: string) {
        // Split the Data URI to get the MIME type and Base64 content
        const [header, base64Data] = dataURI.split(',');
        const match = /:(.*?);/.exec(header);
        if (!match) {
            throw new Error('Invalid data URI format');
        }
        const mimeType = match[1]; // Extract MIME type
        // Convert Base64 to raw binary data
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i += 1) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        // Create a Blob from the binary data
        const blob = new Blob([byteNumbers], { type: mimeType });
        // Generate a Blob URL
        return URL.createObjectURL(blob);
    }
}

export default PDFToImagesConverter;
