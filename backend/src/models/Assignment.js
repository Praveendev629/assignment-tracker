const mongoose = require('mongoose');
const assignmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true, trim: true },
  assignmentTitle: { type: String, required: true, trim: true },
  marks: { type: Number, required: true, min: 0 },
  submissionDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Assignment', assignmentSchema);
