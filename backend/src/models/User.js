const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  gmail: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true, trim: true, maxlength: 50 },
  profilePhoto: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('User', userSchema);
