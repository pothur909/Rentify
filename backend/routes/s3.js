const express = require("express");
const router = express.Router();
const {
  generatePresignedUrl,
  generatePresignedGetUrl,
} = require("../services/s3Services");

// GET /api/s3/generateUrl?fileName=abc.png&fileType=image/png
router.get("/generateUrl", async (req, res) => {
  try {
    const { fileName, fileType } = req.query;

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ error: "fileName and fileType are required" });
    }

    const { signedUrl, fileUrl } = await generatePresignedUrl(
      fileName,
      fileType
    );

    res.json({ signedUrl, fileUrl });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({ error: "Could not generate URL" });
  }
});

// optional view url if bucket is private
router.get("/getPresignedUrl", async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ error: "key is required" });
    }

    const url = await generatePresignedGetUrl(key);
    res.json({ url });
  } catch (err) {
    console.error("Error generating presigned GET URL:", err);
    res.status(500).json({ error: "Could not generate GET URL" });
  }
});

module.exports = router;
