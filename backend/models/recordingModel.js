const { model, Schema, Types } = require('../connection');

const recordingSchema = new Schema({
    title: String,
    screenUrl: String, // URL for screen recording
    webcamUrl: String, // URL for webcam recording
    duration: Number, // duration in seconds
    type: String, // type of recording (e.g., screen+webcam)
    lecture: { type: Types.ObjectId, ref: 'lectures' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('recordings', recordingSchema);