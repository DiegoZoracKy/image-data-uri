'use strict';

let fs = require('fs-extra');
let request = require('request');
let path = require('path');

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

		let regExMatches = dataURI.match('data:image/(.*);base64,(.*)');
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

			fs.readFile(filePath, (err, data) => {
				if (err) {
					return reject('ImageDataURI :: Error :: ' + JSON.stringify(err, null, 4));
				}

				return resolve(ImageDataURI.encode(data, path.extname(filePath).replace('.', '')));
			});
		});

	}

	function encodeFromURL(imageURL) {
		return new Promise((resolve, reject) => {
			if (!imageURL) {
				reject('ImageDataURI :: Error :: Missing some of the required params: imageURL');
				return null;
			}

			request.get(imageURL, {
				encoding: null
			}, (err, response, body) => {
				if (err) {
					return reject('ImageDataURI :: Error :: ' + JSON.stringify(err, null, 4));
				}
				if (response.statusCode == 200) {
					return resolve(ImageDataURI.encode(body, response.headers["content-type"]));
				}
			});
		});

	}

	function outputFile(dataURI, filePath) {
		filePath = filePath || './';
		return new Promise((resolve, reject) => {
			let imageDecoded = decode(dataURI);
			filePath = (!!path.extname(filePath)) ? filePath : filePath + '.' + imageDecoded.imageType;
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