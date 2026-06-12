const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const User = require('../models/User');

const genToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { firebaseToken, gmail, username, profilePhoto } = req.body;

    // Verify the Firebase ID token
    const decoded = await admin.auth().verifyIdToken(firebaseToken);
    if (decoded.email !== gmail) return res.status(401).json({ message: 'Token mismatch' });

    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      // Use provided username, fall back to Google display name, then email prefix
      const resolvedUsername =
        (username && username.trim()) ||
        (decoded.name && decoded.name.trim()) ||
        gmail.split('@')[0];

      user = await User.create({
        firebaseUid: decoded.uid,
        gmail,
        username: resolvedUsername,
        profilePhoto: profilePhoto || decoded.picture || '',
      });
    }

    res.json({ token: genToken(user._id), user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

const getProfile = async (req, res) => res.json({ user: req.user });

const updateUsername = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username: req.body.username },
      { new: true },
    );
    res.json({ user });
  } catch {
    res.status(500).json({ message: 'Update failed' });
  }
};

module.exports = { login, getProfile, updateUsername };
