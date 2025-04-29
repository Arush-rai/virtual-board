const express = require('express');

const router = express.Router();
const Model = require('../models/studentModel');
const ClassModel = require('../models/classModel');

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

router.post('/add-to-class', async (req, res) => {
    const { email, classId } = req.body;

    try {
        // Find the student by email
        const student = await Model.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Add the student to the class
        const classroom = await ClassModel.findByIdAndUpdate(
            classId,
            { $addToSet: { students: student._id } }, // Prevent duplicates
            { new: true }
        ).populate('students');

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        res.status(200).json({ message: 'Student added to class', classroom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;