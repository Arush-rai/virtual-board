const { model, Schema, Types } = require('../connection');

const announcementSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    attachments: [String] // Optional: for storing attachment URLs
});

const mySchema = new Schema({
    name: String,
    timeslot: String,
    subject: String,
    teacher: { type : Types.ObjectId, ref : 'teacher' },
    students: [{ type : Types.ObjectId, ref : 'student', default: [] }],
    announcements: [announcementSchema], // Add the announcements field
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('classroom', mySchema);