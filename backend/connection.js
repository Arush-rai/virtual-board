const mongoose = require('mongoose');

const url = 'mongodb+srv://raiarush004:1234@cluster0.tzcfuiz.mongodb.net/virtual-board?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(url)
    .then((result) => {
        console.log('database connected');
    }).catch((err) => {
        console.log(err);
    });

module.exports = mongoose;