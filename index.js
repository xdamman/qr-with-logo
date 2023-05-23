const qrcode = require("qrcode");
const sharp = require("sharp");
const fs = require("fs");

function validateParams(
  embedded_data,
  logo_image_path,
  qr_options,
  output_type,
  saveas_file_name
) {
  const ERRORS = {
    INSUFF_PARAMS: {
      name: "InsufficientParameters Error",
      message: " is required when outputting QR code ",
    },
    ERR_CK: {
      name: "ErrorChecking Error",
      message: "Error occurred while error-checking parameters",
    },
    INVALID_IMGFILE: {
      name: "InvalidImageFilePath Error",
      message: " is an invalid image file path for the parameter ",
    },
  };

  if (embedded_data && logo_image_path && output_type) {
    if (output_type == "png") {
      if (!saveas_file_name || typeof saveas_file_name != "string") {
        throw SyntaxError(
          JSON.stringify({
            name: ERRORS["INSUFF_PARAMS"].name,
            message:
              "saveas_file_name" + ERRORS["INSUFF_PARAMS"].message + "to png",
          })
        );
      }
    }
  }

  if (!output_type) {
    throw SyntaxError(
      JSON.stringify({
        name: ERRORS["INSUFF_PARAMS"].name,
        message: "output_type" + ERRORS["INSUFF_PARAMS"].message,
      })
    );
  } else if (!embedded_data && logo_image_path && output_type) {
    throw SyntaxError(
      JSON.stringify({
        name: ERRORS["INSUFF_PARAMS"].name,
        message:
          "embedded_data" +
          ERRORS["INSUFF_PARAMS"].message +
          "to " +
          output_type,
      })
    );
  } else if (!logo_image_path && embedded_data && output_type) {
    throw SyntaxError(
      JSON.stringify({
        name: ERRORS["INSUFF_PARAMS"].name,
        message:
          "logo_image_path" +
          ERRORS["INSUFF_PARAMS"].message +
          "to " +
          output_type,
      })
    );
  }

  if (logo_image_path.lastIndexOf(".") == "-1") {
    throw SyntaxError(
      JSON.stringify({
        name: ERRORS["INVALID_IMGFILE"].name,
        message:
          logo_image_path +
          ERRORS["INVALID_IMGFILE"].message +
          "logo_image_path",
      })
    );
  }

  if (saveas_file_name && saveas_file_name.lastIndexOf(".") == "-1") {
    throw SyntaxError(
      JSON.stringify({
        name: ERRORS["INVALID_IMGFILE"].name,
        message:
          saveas_file_name +
          ERRORS["INVALID_IMGFILE"].message +
          "saveas_file_name  Ensure that .png was included",
      })
    );
  }

  if (qr_options.length == 0) {
    qr_options = { errorCorrectionLevel: "H" };
  }
}

async function generateQRWithLogo(
  embedded_data, // qr code data
  logo_image_path, // relative path
  qr_options,
  output_type, // base64 or png
  saveas_file_name
) {
  validateParams(
    embedded_data,
    logo_image_path,
    qr_options,
    output_type,
    saveas_file_name
  );

  qr_options = qr_options || {};
  qr_options.width = qr_options.width || 600;
  qr_options.margin = qr_options.margin || 1;

  const b64 = await generateQR(embedded_data, qr_options);

  // console.log(">>> b64", b64);
  const qrlogo_b64 = await addLogoToQRImage(
    b64,
    logo_image_path,
    output_type,
    saveas_file_name
  );
  if (output_type == "png") {
    return saveas_file_name;
  } else {
    return qrlogo_b64;
  }
}

async function generateQR(embedded_data, options) {
  options = options || { errorCorrectionLevel: "H" };
  try {
    return await qrcode.toDataURL(embedded_data, options);
  } catch (err) {
    console.error(err);
  }
}

async function saveAspng(b64, filename) {
  console.log("Saving QR as: " + filename);
  let base64Data = await b64.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync(filename, base64Data, "base64");
  return filename;
}

async function addLogoToQRImage(
  b64,
  logo_image_path,
  output_type,
  saveas_file_name
) {
  const newImage = await sharp(
    Buffer.from(b64.replace(/^data:image\/png;base64,/, ""), "base64")
  ).composite([{ input: logo_image_path, gravity: "centre" }]);

  if (output_type == "base64") {
    const buf = await newImage.toBuffer();
    let base64data = Buffer.from(buf, "binary").toString("base64");
    return base64data;
  } else if (output_type == "png") {
    await newImage.toFile(saveas_file_name);
    return saveas_file_name;
  }
}

exports.generateQRWithLogo = generateQRWithLogo;
