const fs = require("fs-extra");
const assert = require("assert");

const ImageDataURI = require("../lib/image-data-uri");

const matchMediaType = /^data:([^;,]+)[;,]/;

describe("ImageDataURI", () => {
  describe("encodeFromFile", () => {
    it("declares correct media type for test-file.jpg", () => {
      return ImageDataURI.encodeFromFile("test/test-file.jpg").then(dataURI => {
        const m = dataURI.match(matchMediaType);
        assert.equal("image/jpeg", m[1]);
      });
    });

    it("declares correct media type for test-file-alternate.jpeg", () => {
      return ImageDataURI.encodeFromFile("test/test-file-alternate.jpeg").then(
        dataURI => {
          const m = dataURI.match(matchMediaType);
          assert.equal("image/jpeg", m[1]);
        }
      );
    });

    it("declares correct media type for test-file.svg", () => {
      return ImageDataURI.encodeFromFile("test/test-file.svg").then(dataURI => {
        const m = dataURI.match(matchMediaType);
        assert.equal("image/svg+xml", m[1]);
      });
    });

    it("fails when media type is unknown", () => {
      return ImageDataURI.encodeFromFile("unknown").catch(error => {
        assert.equal(
          "ImageDataURI :: Error :: Couldn't recognize media type for file",
          error
        );
      });
    });
  });

  describe("encodeFromURL", () => {
    it("declares correct media type for a google logo", () => {
      return ImageDataURI.encodeFromURL("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png").then(dataURI => {
        const m = dataURI.match(matchMediaType);
        assert.equal("image/png", m[1]);
      });
    });
    it("fails on a 404 URL", () => {
      return ImageDataURI.encodeFromURL("http://150dcace0756dba5a895-b1479f7526781e2361a99185a4979d91.r53.cf1.rackcdn.com/library/assets/825127ec")
        .catch(err => {
          assert.ok(typeof err === 'string');
        });
    });
  });

  describe("outputFile", () => {
    const outputFilePath = `${__dirname}/tmp-output`;
    const expectedOutputFile = `${__dirname}/tmp-output.svg`;

    it("writes image/svg+xml data to a file with .svg extension", () => {
      return ImageDataURI.encodeFromFile("test/test-file.svg")
        .then(dataURI => ImageDataURI.outputFile(dataURI, outputFilePath))
        .then(outputPath => assert.equal(expectedOutputFile, outputPath));
    });

    after(function() {
      fs.removeSync(expectedOutputFile);
    });
  });
});
