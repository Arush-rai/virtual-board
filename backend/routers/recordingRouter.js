const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
const Model = require('../models/recordingModel');
const verifyToken = require('../middlewares/verifyToken');

cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET',
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

router.get('/getbyclassroom/:classroomId', (req, res) => {
    Model.find({ classroom: req.params.classroomId })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Upload video to Cloudinary and save metadata
router.post('/upload', verifyToken, upload.single('video'), async (req, res) => {
  try {
    const { title, duration, type, lecture } = req.body;
    const fileStr = `data:video/webm;base64,${req.file.buffer.toString('base64')}`;
    const uploadRes = await cloudinary.uploader.upload(fileStr, {
      resource_type: 'video',
      folder: 'recordings'
    });

    const recording = await Model.create({
      title,
      url: uploadRes.secure_url,
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

module.exports = router;