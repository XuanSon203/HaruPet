const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configuration CLoudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

module.exports.upload = async (req, res, next) => {
  // Nếu không có file nào được upload (user không chọn file mới)
  if (!req.file) {
    return next(); // Bỏ qua xử lý upload, chuyển tiếp middleware tiếp theo
  }

  try {
    console.log("file được upload:", req.file);

    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    let result = await streamUpload(req);

    // Gán đường dẫn ảnh vào đúng field
    req.body[req.file.fieldname] = result.secure_url;

    next();
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    return res.status(500).send("Lỗi upload ảnh");
  }
};
