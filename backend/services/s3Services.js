const { PutObjectCommand, GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const bucketName = process.env.S3_BUCKET_NAME;

console.log("AWS Configuration:");
console.log("Region:", process.env.AWS_REGION);
console.log("Bucket:", bucketName);
console.log("Access Key ID exists:", !!process.env.AWS_ACCESS_KEY_ID);
console.log("Secret Key exists:", !!process.env.AWS_SECRET_ACCESS_KEY);

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// generate signed PUT url for upload
exports.generatePresignedUrl = async (fileName, fileType) => {
  const key = `brokers/profile-pictures/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
    // uncomment if you want objects publicly readable by default
    // ACL: "public-read",
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  // we return both signed url and plain file url that you will save in DB
  const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { signedUrl: url, fileUrl };
};

// optional - generate signed GET url if bucket is private
exports.generatePresignedGetUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });
  return url;
};
