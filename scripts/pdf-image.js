const fs = require('fs');
const https = require('https');
const pdf2img = require('pdf-img-convert');
const sizeOf = require('image-size');

const fileList = [
    
    {
      "kind": "drive#file",
      "mimeType": "application/pdf",
      "id": "1JzLPtQwnZoPNMjxPf7fLycIfnNlEeMQ9",
      "name": "VERIFIED_18-10-2023_1000_Bescom.pdf"
    },
];
fileList.forEach((file) => {
    const url = `https://drive.usercontent.google.com/download?id=${file.id}&export=download&authuser=0`;
    console.log('URL:', file.name);
    try {
        let outputImages1 = pdf2img.convert(url);
        console.log('Pdf to image started');
        // From here, the images can be used for other stuff or just saved if that's required:
        outputImages1.then(function (outputImages) {
            console.log('Image: ', outputImages);
            let imgFile;
            for (let i = 0; i < outputImages.length; i++) {
                imgFile = `${file.name}.png`;
                fs.writeFile(imgFile, outputImages[i], function (error) {
                    if (error) {
                        console.error("Error: " + error);
                    } else {
                        console.log('Image created. Filename: ', imgFile);
                        sizeOf(imgFile, (err, dimensions) => {
                            console.log('File ', file.name, ' dimensions: ', dimensions.width, 'x', dimensions.height);
                            const result = fuzzyMap(dimensions.width, dimensions.height);
                            console.log(result); // Output: 'a4'
                        });
                    }
                });
            }
        }).catch((e) => {
            console.log(e);
        });
    } catch (e) {
        console.log(e);
    };
})
// URL of the image 



const MAX_DEVIATION_IN_PERCENTAGE = 0.15;

function fuzzyMap(width, height, mapping = standardMapping) {
    const dimensions = Object.keys(mapping).map(dim => dim.split('x').map(Number));

    const maxWidthDeviation = width * MAX_DEVIATION_IN_PERCENTAGE;
    const maxHeightDeviation = height * MAX_DEVIATION_IN_PERCENTAGE;

    let matches = [];
    dimensions.forEach((dim, index) => {
        const [mappedWidth, mappedHeight] = dim;
        const maxWidth = Math.abs(width + maxWidthDeviation);
        const minWidth = Math.abs(width - maxWidthDeviation);
        const maxHeight = Math.abs(height + maxHeightDeviation);
        const minHeight = Math.abs(height - maxHeightDeviation);

        if (mappedWidth <= maxWidth && mappedWidth >= minWidth && mappedHeight <= maxHeight && mappedHeight >= minHeight) {
            matches.push({
                key: `${mappedWidth}x${mappedHeight}`,
                widthDev: Math.abs(mappedWidth - width),
                heightDev: Math.abs(mappedHeight - height),

            });
        }
    });
    let matchKey;
    if (matches.length > 1) {
        let lastWidthDev;
        let lastHeightDev;
        matches.forEach((match) => {
            const { key, widthDev, heightDev } = match;
            if ((!lastHeightDev && !lastWidthDev) ||
                (lastWidthDev >= widthDev && lastHeightDev >= heightDev) &&
                (lastWidthDev >= widthDev && lastHeightDev < heightDev && Math.abs(lastWidthDev - widthDev) >= Math.abs(lastHeightDev - heightDev)) &&
                (lastWidthDev < widthDev && lastHeightDev >= heightDev && Math.abs(lastWidthDev - widthDev) <= Math.abs(lastHeightDev - heightDev))) {
                lastWidthDev = widthDev;
                lastHeightDev = heightDev;
                matchKey = key;
            }
        });
    } else if (matches.length) {
        matchKey = matches[0].key;
    }
    return matchKey ? mapping[matchKey] : undefined;
}

// Example usage:
const standardMapping = {
    '700x1000': 'a4',
    '400x1000': 'diesel',
    '290x1000': 'bwssb',
    '350x1000': 'bescom',
    '1000x650': 'voucher'
};

// voucher -
    // - housekeeping salary - 8500
    // - gardener salary - 1500
    // - Extra work - 500
    // - Septic tank cleaning - 800
    // - Water tank cleaning - 1500
    // - Coffee bill - 150
    // - Drinking water 300
    // - RR cleaining

// A4
    // - Security Bill - 41000
    // - Generator
    // - Lift Repair
    // - 
