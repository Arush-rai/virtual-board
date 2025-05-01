const express = require('express');

const router = express.Router();
const Model = require('../models/lectureModel');
const verifyToken = require('../middlewares/verifyToken');

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

})

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

module.exports = router;