const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const path = require('path');

const router = express.Router();
const Model = require('../models/lectureModel');
const verifyToken = require('../middlewares/verifyToken');
require('dotenv').config();

// Configure Cloudinary
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

router.get('/getbyclassroom/:classroomId', (req, res) => {
    Model.find({ classroom: req.params.classroomId })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get lecture by ID
router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            if (!result) return res.status(404).json({ error: 'Lecture not found' });
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Add material to lecture
router.post('/material/:lectureId', verifyToken, upload.single('material'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const lectureId = req.params.lectureId;
    const fileBuffer = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(fileBuffer, {
      resource_type: 'auto', // Automatically detect resource type (image, pdf, video etc)
      folder: 'lecture-materials',
      public_id: `lecture_${lectureId}_${Date.now()}`,
      format: path.extname(req.file.originalname).substring(1) || 'auto'
    });

    // Update the lecture with the new material URL
    console.log(uploadResult.url);
    
    const updatedLecture = await Model.findByIdAndUpdate(
      lectureId,
      { $push: { material: uploadResult.url } },
      { new: true }
    );

    if (!updatedLecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    res.status(200).json({
      message: 'Material uploaded successfully',
      materialUrl: uploadResult.url,
      lecture: updatedLecture
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to upload material', details: err.message });
  }
});

// Get all materials for a lecture
router.get('/material/:lectureId', async (req, res) => {
  try {
    const lecture = await Model.findById(req.params.lectureId);
    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }
    
    res.status(200).json(lecture.material || []);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// Delete a material from lecture
router.delete('/material/:lectureId/:materialIndex', verifyToken, async (req, res) => {
  try {
    const lectureId = req.params.lectureId;
    const materialIndex = parseInt(req.params.materialIndex);
    
    // Get the lecture
    const lecture = await Model.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }
    
    // Check if material exists at the given index
    if (!lecture.material || materialIndex < 0 || materialIndex >= lecture.material.length) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    // Get the material URL
    const materialUrl = lecture.material[materialIndex];
    
    // Extract public_id from the Cloudinary URL
    const publicId = materialUrl.split('/').slice(-1)[0].split('.')[0];
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(`lecture-materials/${publicId}`);
    
    // Remove material from lecture
    lecture.material.splice(materialIndex, 1);
    await lecture.save();
    
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

module.exports = router;