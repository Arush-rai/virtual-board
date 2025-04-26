const express = require('express');
const Teacher = require('../models/teacherModel');

const router = express.Router();
const Model = require('../models/teacherModel');

require('dotenv').config();
const jwt = require('jsonwebtoken');

router.post('/add', (req, res) => {
    new Model(req.body).save()
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

})
router.post('/authenticate', (req, res) => {
    Model.findOne(req.body)
        .then((result) => {
            if (result) {
                const { _id, name, email, password } = result;
                const payload = { _id, name, email, password };

                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' },
                    (error, token) => {
                        if (error) res.status(500).json(error);
                        else {
                            res.status(200).json({ token });
                        }
                    }
                )

            }
            else res.status(401).json({ message: 'login failed' });
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
})

router.get('/authorise', (req, res) => {
    res.status(200).json({ allowed: true })
})

// Get teacher profile by ID
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update teacher profile by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTeacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.status(200).json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;