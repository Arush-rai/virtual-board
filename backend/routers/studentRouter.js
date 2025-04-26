const express = require('express');

const router = express.Router();
const Model = require('../models/studentModel');

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



module.exports = router;