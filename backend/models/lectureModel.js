const { model, Schema, Types } = require('../connection');

const mySchema = new Schema({
    lecture_Number: String,
    timeslot: String,
    topic: String,
    canvas: String,
    recording: String,
    classroom: { type : Types.ObjectId, ref : 'classroom' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('lectures', mySchema);