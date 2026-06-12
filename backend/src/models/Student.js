const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  initial: { type: String, default: '', trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Student', studentSchema);
