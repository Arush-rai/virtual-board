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

// Add a new announcement to a classroom
router.post('/announcement/:classId', verifyToken, async (req, res) => {
    try {
        const { title, content, attachments } = req.body;
        const classId = req.params.classId;
        
        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        
        // Verify that the teacher owns this classroom
        const classroom = await Model.findOne({ 
            _id: classId,
            teacher: req.user._id
        });
        
        if (!classroom) {
            return res.status(403).json({ error: 'Not authorized or classroom not found' });
        }
        
        // Create and add the announcement
        const announcement = {
            title,
            content,
            attachments: attachments || [],
            createdAt: new Date()
        };
        
        const updatedClassroom = await Model.findByIdAndUpdate(
            classId,
            { $push: { announcements: announcement } },
            { new: true }
        );
        
        res.status(200).json(updatedClassroom.announcements[updatedClassroom.announcements.length - 1]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to add announcement' });
    }
});

// Get all announcements for a classroom
router.get('/announcement/:classId', verifyToken, async (req, res) => {
    try {
        const classroom = await Model.findById(req.params.classId);
        
        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }
        
        // Check if user is either the teacher or a student of this classroom
        const isTeacher = classroom.teacher.toString() === req.user._id.toString();
        const isStudent = classroom.students.some(id => id.toString() === req.user._id.toString());
        
        if (!isTeacher && !isStudent) {
            return res.status(403).json({ error: 'Not authorized to view these announcements' });
        }
        
        res.status(200).json(classroom.announcements || []);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

// Delete an announcement
router.delete('/announcement/:classId/:announcementId', verifyToken, async (req, res) => {
    try {
        const { classId, announcementId } = req.params;
        
        // Verify that the teacher owns this classroom
        const classroom = await Model.findOne({ 
            _id: classId,
            teacher: req.user._id
        });
        
        if (!classroom) {
            return res.status(403).json({ error: 'Not authorized or classroom not found' });
        }
        
        // Remove the announcement
        const updatedClassroom = await Model.findByIdAndUpdate(
            classId,
            { $pull: { announcements: { _id: announcementId } } },
            { new: true }
        );
        
        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to delete announcement' });
    }
});

// Update an announcement
router.put('/announcement/:classId/:announcementId', verifyToken, async (req, res) => {
    try {
        const { classId, announcementId } = req.params;
        const { title, content, attachments } = req.body;
        
        // Verify that the teacher owns this classroom
        const classroom = await Model.findOne({ 
            _id: classId,
            teacher: req.user._id
        });
        
        if (!classroom) {
            return res.status(403).json({ error: 'Not authorized or classroom not found' });
        }
        
        // Find and update the specific announcement in the array
        const updatedClassroom = await Model.findOneAndUpdate(
            { 
                _id: classId,
                'announcements._id': announcementId 
            },
            { 
                $set: { 
                    'announcements.$.title': title,
                    'announcements.$.content': content,
                    'announcements.$.attachments': attachments || []
                } 
            },
            { new: true }
        );
        
        if (!updatedClassroom) {
            return res.status(404).json({ error: 'Announcement not found' });
        }
        
        // Find the updated announcement to return
        const updatedAnnouncement = updatedClassroom.announcements.find(
            a => a._id.toString() === announcementId
        );
        
        res.status(200).json(updatedAnnouncement);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to update announcement' });
    }
});

module.exports = router;