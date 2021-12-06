interface ImageData {
    imageType: string,
    dataBase64: string,
    dataBuffer: Buffer
}

interface Options {
    timeout: number
}


declare namespace ImageDataURI {
    function decode (dataURI: string): ImageData;
    function encode (data: ImageData, mediaType: string): string;
    function encodeFromURL(filePath: string): Promise<string>;
    function encodeFromFile(imageURL: string, options: Options): Promise<string>;
    function outputFile(dataURI: string, filePath: string): Promise<string>;
}

