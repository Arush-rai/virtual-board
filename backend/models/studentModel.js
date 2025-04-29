const { model, Schema } = require('../connection');

const mySchema = new Schema({
  
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now }
    
});


module.exports = model('student', mySchema);