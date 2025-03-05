const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_Key,
  api_secret: process.env.api_Secret,
});

module.exports = cloudinary;
