const QRLogo = require("../index.js");

const data = JSON.stringify({
  name: "Zacharie Happel",
  job: "Student/Intern",
  grade: "Senior",
});

async function testPNG() {
  const res = await QRLogo.generateQRWithLogo(
    data,
    "test/node-js-logo.png",
    {},
    "PNG",
    "qrlogo.png"
  );
  console.log(">>> res", res);
}

async function testBase64() {
  const res = await QRLogo.generateQRWithLogo(
    data,
    "test/node-js-logo.png",
    {},
    "Base64",
    "qrlogo.png"
  );
  console.log(">>> res", res);
}

async function performTests() {
  await testPNG();
  //   await testBase64();
}

performTests();
