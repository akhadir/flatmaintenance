let pdf2img = require('pdf-img-convert');
let outputImages1 = pdf2img.convert('https://drive.google.com/file/d/1OiyjTpiRkICylIc0HjyMEktu66zw4Pel/view');

// From here, the images can be used for other stuff or just saved if that's required:

let fs = require('fs');

outputImages1.then(function(outputImages) {
    for (let i = 0; i < outputImages.length; i++)
        fs.writeFile("output"+i+".png", outputImages[i], function (error) {
          if (error) { console.error("Error: " + error); }
    });
});