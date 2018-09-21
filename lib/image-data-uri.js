'use strict';

let fs = require('fs-extra');
let request = require('request');
let path = require('path');
let mimeTypes = require('mime-types');

let ImageDataURI = (() => {

	const api = {
		decode: decode,
		encode: encode,
		encodeFromURL: encodeFromURL,
		encodeFromFile: encodeFromFile,
		outputFile: outputFile
	};

	function decode(dataURI) {
		if (!/data:image\//.test(dataURI)) {
			console.log('ImageDataURI :: Error :: It seems that it is not an Image Data URI. Couldn\'t match "data:image\/"');
			return null;
		}

		let regExMatches = dataURI.match('data:(image/.*);base64,(.*)');
		return {
			imageType: regExMatches[1],
			dataBase64: regExMatches[2],
			dataBuffer: new Buffer(regExMatches[2], 'base64')
		};
	}

	function encode(data, mediaType) {
		if (!data || !mediaType) {
			console.log('ImageDataURI :: Error :: Missing some of the required params: data, mediaType ');
			return null;
		}

		mediaType = (/\//.test(mediaType)) ? mediaType : 'image/' + mediaType;
		let dataBase64 = (Buffer.isBuffer(data)) ? data.toString('base64') : new Buffer(data).toString('base64');
		let dataImgBase64 = 'data:' + mediaType + ';base64,' + dataBase64;

		return dataImgBase64;
	}

	function encodeFromFile(filePath) {
		return new Promise((resolve, reject) => {
			if (!filePath) {
				reject('ImageDataURI :: Error :: Missing some of the required params: filePath');
				return null;
			}

			let mediaType = mimeTypes.lookup(filePath);
			if (!mediaType) {
				reject('ImageDataURI :: Error :: Couldn\'t recognize media type for file');
			}

			fs.readFile(filePath, (err, data) => {
				if (err) {
					return reject('ImageDataURI :: Error :: ' + JSON.stringify(err, null, 4));
				}

				return resolve(ImageDataURI.encode(data, mediaType));
			});
		});

	}

	function encodeFromURL(imageURL, options) {
		return new Promise((resolve, reject) => {
			if (!imageURL) {
				reject('ImageDataURI :: Error :: Missing some of the required params: imageURL');
				return null;
			}
			options = options || {};
			request.get(imageURL, {
				encoding: null,
				timeout: options.timeout || 6000
			}, (err, response, body) => {
				if (err) {
					return reject('ImageDataURI :: Error :: ' + JSON.stringify(err, null, 4));
				}
				if (response.statusCode == 200) {
					return resolve(ImageDataURI.encode(body, response.headers["content-type"]));
				} else {
					return reject('ImageDataURI :: Error :: GET -> ' + imageURL + ' returned an HTTP ' + response.statusCode + ' status!');
				}
			});
		});

	}

	function outputFile(dataURI, filePath) {
		filePath = filePath || './';
		return new Promise((resolve, reject) => {
			let imageDecoded = decode(dataURI);
			filePath = (!!path.extname(filePath))
				? filePath
				: filePath + '.' + mimeTypes.extension(imageDecoded.imageType);
			fs.outputFile(filePath, imageDecoded.dataBuffer, err => {
				if (err) {
					return reject('ImageDataURI :: Error :: ' + JSON.stringify(err, null, 4));
				}

				resolve(filePath);
			});
		});
	}

	return api;

})();

module.exports = ImageDataURI;
