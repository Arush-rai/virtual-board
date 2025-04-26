const { model, Schema, Types } = require('../connection');

const mySchema = new Schema({
    name: String,
    timeslot: String,
    subject: String,
    teacher: { type : Types.ObjectId, ref : 'teacher' },
    students: [{ type : Types.ObjectId, ref : 'student', default: [] }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('classroom', mySchema);