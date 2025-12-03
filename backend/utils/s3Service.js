// // utils/s3Service.js
// const { PutObjectCommand, GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// require("dotenv").config();

// const bucketName = process.env.S3_BUCKET_NAME;

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// exports.generatePresignedPutUrl = async (fileName, fileType) => {
//   const key = `profile-pictures/${Date.now()}-${fileName}`;

//   const command = new PutObjectCommand({
//     Bucket: bucketName,
//     Key: key,
//     ContentType: fileType,
//   });

//   const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

//   return { uploadUrl, key };
// };

// exports.getPublicUrlFromKey = (key) => {
//   if (!key) return null;
//   return `https://${bucketName}.s3.amazonaws.com/${key}`;
// };



// backend/utils/s3Service.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const bucketName = process.env.S3_BUCKET_NAME;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.generatePresignedPutUrl = async (fileName, fileType) => {
  const key = `profile-pictures/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  return { uploadUrl, key };
};

exports.getPublicUrlFromKey = (key) => {
  if (!key) return null;
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
};
