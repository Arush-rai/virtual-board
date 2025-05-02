const express = require('express');

const router = express.Router();
const Model = require('../models/classModel');
const verifyToken = require('../middlewares/verifyToken');
const StudentModel = require('../models/studentModel'); // Import the Student model

router.post('/add', verifyToken, (req, res) => {
    console.log(req.body);

    req.body.teacher = req.user._id;
    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/addstudents', async (req, res) => {
    const { classId, studentEmail } = req.body;
    console.log(classId, studentEmail);

    // if (!classId || !Array.isArray(studentEmail)) {
    //     return res.status(400).json({ error: 'Invalid input. Provide classId and an array of student emails.' });
    // }

    try {
        // Fetch student IDs based on emails
        const student = await StudentModel.findOne({ email: studentEmail });
        console.log(student);

        // const studentIds = students.map(student => student._id);

        if (!student) {
            return res.status(404).json({ error: 'No students found for the provided emails.' });
        }

        // Update the class with the fetched student IDs
        const updatedClass = await Model.findByIdAndUpdate(
            classId,
            { $push: { students: student._id } }, // Add students without duplicates
            { new: true } // Return the updated document
        );

        if (!updatedClass) {
            return res.status(404).json({ error: 'Class not found.' });
        }

        res.status(200).json(updatedClass);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
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

router.get('/getbyteacher', verifyToken, async (req, res) => {
    try {
        // Find classrooms created by the teacher
        const classrooms = await Model.find({ teacher: req.user._id });

        if (!classrooms || classrooms.length === 0) {
            return res.status(404).json({ error: 'No classrooms found for this teacher.' });
        }
        res.status(200).json(classrooms);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch classrooms.' });
    }
});

// Get classrooms for a student
router.get('/getbystudent', verifyToken, async (req, res) => {
    try {
        // Find classrooms where the student's _id is in the students array
        const classrooms = await Model.find({ students: req.user._id });

        res.status(200).json(classrooms);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch classrooms.' });
    }
});

// Get classroom details by ID (with students populated)
router.get('/getbyid/:id', verifyToken, async (req, res) => {
    try {
        // Populate the 'students' field to get student details
        const classroom = await Model.findById(req.params.id).populate('students');
        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found.' });
        }
        res.status(200).json(classroom);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch classroom.' });
    }
});

module.exports = router;