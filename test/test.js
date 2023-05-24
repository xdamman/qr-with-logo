const QRLogo = require("../index.js");

const QRCodeData = JSON.stringify({
  name: "Zacharie Happel",
  job: "Student/Intern",
  grade: "Senior",
});

async function testPNG() {
  const res = await QRLogo.generateQRWithLogo(
    QRCodeData,
    "https://vouchergenerator.regensunite.earth/nft-logo.png",
    {},
    "png",
    "qrcode.png"
  );
  console.log(">>> res", res);
}

async function testBase64() {
  const res = await QRLogo.generateQRWithLogo(
    QRCodeData,
    "test/node-js-logo.png",
    {},
    "base64"
  );
  console.log(">>> res", res);
}

async function performTests() {
  await testPNG();
  await testBase64();
}

performTests();
