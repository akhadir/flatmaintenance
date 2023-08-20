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

export default { extractFirstImage: getPDFImageDimension };
