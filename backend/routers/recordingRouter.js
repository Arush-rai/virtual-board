const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const path = require('path');
const fs = require('fs');

const router = express.Router();
const Model = require('../models/recordingModel');
const verifyToken = require('../middlewares/verifyToken');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/add', verifyToken, (req, res) => {
    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/delete/:id', verifyToken, (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });

});

router.get('/getbylecture/:lectureId', (req, res) => {
    Model.find({ lecture: req.params.lectureId })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Upload screen and webcam videos to Cloudinary and save metadata
router.post('/upload', verifyToken, upload.fields([
  { name: 'screen', maxCount: 1 },
  { name: 'webcam', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, duration, type, lecture } = req.body;
    const screenFile = req.files['screen']?.[0];
    const webcamFile = req.files['webcam']?.[0];
    if (!screenFile || !webcamFile) {
      return res.status(400).json({ error: 'Both screen and webcam videos are required.' });
    }
    const screenStr = `data:video/webm;base64,${screenFile.buffer.toString('base64')}`;
    const webcamStr = `data:video/webm;base64,${webcamFile.buffer.toString('base64')}`;
    const [screenUpload, webcamUpload] = await Promise.all([
      cloudinary.uploader.upload(screenStr, {
        resource_type: 'video',
        folder: 'recordings/screen'
      }),
      cloudinary.uploader.upload(webcamStr, {
        resource_type: 'video',
        folder: 'recordings/webcam'
      })
    ]);
    const recording = await Model.create({
      title,
      screenUrl: screenUpload.secure_url,
      webcamUrl: webcamUpload.secure_url,
      duration,
      type,
      lecture,
    });
    res.status(200).json(recording);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Multer storage for lecture material (local or memory, adjust as needed)
const materialUpload = multer({ storage: multer.memoryStorage() });

// Upload lecture material endpoint
router.post('/upload-material/:lectureId', verifyToken, materialUpload.array('material', 10), async (req, res) => {
  try {
    const { lectureId } = req.params;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No material files uploaded.' });
    }

    // Upload each file to Cloudinary (or save locally if you prefer)
    const materialUrls = [];
    for (const file of req.files) {
      // You can change resource_type if you want to allow pdf, images, etc.
      const uploadResult = await cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'lecture_material'
        },
        (error, result) => {
          if (error) throw error;
          materialUrls.push(result.secure_url);
        }
      );
      uploadResult.end(file.buffer);
    }

    // Update lecture document with material URLs
    const lecture = await require('../models/lectureModel').findByIdAndUpdate(
      lectureId,
      { $push: { material: { $each: materialUrls } } },
      { new: true }
    );

    res.status(200).json({ message: 'Material uploaded successfully', lecture });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Material upload failed' });
  }
});

module.exports = router;