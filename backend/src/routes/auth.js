const express = require('express');
const router = express.Router();
const { login, getProfile, updateUsername } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { body } = require('express-validator');

router.post('/login', [body('firebaseToken').notEmpty(), body('gmail').isEmail()], login);
router.get('/profile', verifyToken, getProfile);
router.put('/update-username', verifyToken, [body('username').isLength({ min: 2, max: 50 })], updateUsername);
module.exports = router;
