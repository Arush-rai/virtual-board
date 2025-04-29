const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  subjects: { type: [String], required: true },
  classes: { type: [String], required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'default-avatar.png' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Teacher', teacherSchema);