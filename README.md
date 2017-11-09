# Image Data URI

Library to easily decode/encode Data URI images

## Installation

```bash
npm install image-data-uri
```
**CLI**
```bash
npm install image-data-uri -g
```
```bash
npx image-data-uri --help
```

## Methods

- **decode(dataURI)**
```javascript
imageDataURI.decode('data:image/png;base64,SOMEPNGDATAURI/wD/')

// RETURNS
{
    imageType: 'png',
    dataBase64: 'SOMEPNGDATAURI/wD/',
    dataBuffer: <Buffer 89 50 4e 47 0d 0a ...>
}
```

- **encode(data, mediaType)**
```javascript
// Expects a Buffer of a image file
let dataBuffer = new Buffer(imageData);

// PNG | GIF | etc.
let mediaType = 'PNG';

// RETURNS :: image data URI :: 'data:image/png;base64,PNGDATAURI/wD/'
imageDataURI.encode(dataBuffer, mediaType)
```

- **encodeFromURL(imageURL)**
```javascript
// Returns a Promise
imageDataURI.encodeFromURL('http://www.some-site.com/some-image.png')

    // RETURNS image data URI :: 'data:image/png;base64,PNGDATAURI/'
    .then(res => console.log(res))
```
- **encodeFromFile(filePath)**
```javascript
// Returns a Promise
imageDataURI.encodeFromFile('./some-file.png')

    // RETURNS image data URI :: 'data:image/png;base64,PNGDATAURI/'
    .then(res => console.log(res))
```
- **outputFile(dataURI, filePath)**
```javascript
// Some image data uri
let dataURI = 'data:image/png;base64,PNGDATAURI/';

// It will create the full path in case it doesn't exist
// If the extension is defined (e.g. fileName.png), it will be preserved, otherwise the lib will try to guess from the Data URI
let filePath = './out/path/fileName';

// Returns a Promise
imageDataURI.outputFile(dataURI, filePath)

    // RETURNS image path of the created file 'out/path/fileName.png'
    .then(res => console.log(res))
```
