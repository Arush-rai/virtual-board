const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  subjects: { type: [String], required: true },
  classes: { type: [String], required: true },
});

module.exports = mongoose.model('Teacher', teacherSchema);