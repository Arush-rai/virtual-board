const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const Model = require('../models/lectureModel');
const verifyToken = require('../middlewares/verifyToken');
require('dotenv').config();

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create directory for lecture materials if it doesn't exist
    const uploadDir = path.join(__dirname, '../uploads/lecture-materials');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    const lectureId = req.params.lectureId || 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalExt = path.extname(file.originalname);
    cb(null, `lecture_${lectureId}_${uniqueSuffix}${originalExt}`);
  }
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
    'video/mp4', 'video/webm', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, documents, and videos are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
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

// Add material to lecture (local storage)
router.post('/material/:lectureId', verifyToken, upload.single('material'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const lectureId = req.params.lectureId;
    
    // Generate the URL for accessing the file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const relativePath = `/uploads/lecture-materials/${req.file.filename}`;
    const fileUrl = `${baseUrl}${relativePath}`;
    
    // Store metadata about the upload
    const fileData = {
      url: fileUrl,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    };

    // Update the lecture with the new material URL
    const updatedLecture = await Model.findByIdAndUpdate(
      lectureId,
      { $push: { material: fileUrl } },
      { new: true }
    );

    if (!updatedLecture) {
      // If lecture not found, delete the uploaded file to avoid orphaned files
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Lecture not found' });
    }

    res.status(200).json({
      message: 'Material uploaded successfully',
      materialUrl: fileUrl,
      fileData: fileData,
      lecture: updatedLecture
    });
  } catch (err) {
    console.log(err);
    // Clean up the file if an error occurred
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Failed to delete file after error:', unlinkErr);
      }
    }
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

// Delete a material from lecture (updated for local files)
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
    
    // Extract the filename from the URL
    const filename = materialUrl.split('/').pop();
    const filePath = path.join(__dirname, '../uploads/lecture-materials', filename);
    
    // Delete the file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
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