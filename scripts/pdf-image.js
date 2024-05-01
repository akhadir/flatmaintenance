const fs = require('fs');
const https = require('https');
const pdf2img = require('pdf-img-convert');
const sizeOf = require('image-size');

// URL of the image 
const url = 'https://drive.usercontent.google.com/download?id=1O3-yH5r_V8EY50u-03YyUtECUM41kFv4&export=download&authuser=0';
try {
    let outputImages1 = pdf2img.convert(url);
    console.log('Pdf to image started');
    // From here, the images can be used for other stuff or just saved if that's required:
    outputImages1.then(function (outputImages) {
        let imgFile;
        for (let i = 0; i < outputImages.length; i++) {
            imgFile = `output${i}.png`;
            fs.writeFile(imgFile, outputImages[i], function (error) {
                if (error) {
                    console.error("Error: " + error);
                } else {
                    console.log('Image created. Filename: ', imgFile);
                    sizeOf(imgFile, (err, dimensions) => {
                        console.log(dimensions.width, dimensions.height);
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


const MAX_DEVIATION_IN_PERCENTAGE = 0.1;

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
    } else {
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
    '1000x700': 'voucher'
};
