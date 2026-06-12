const express = require('express');
const router = express.Router();
const { createStudent, getStudents, getStudent, deleteStudent } = require('../controllers/studentController');
const { verifyToken } = require('../middleware/auth');
const { body } = require('express-validator');

router.post('/', verifyToken, [body('name').notEmpty().trim()], createStudent);
router.get('/', verifyToken, getStudents);
router.get('/:id', verifyToken, getStudent);
router.delete('/:id', verifyToken, deleteStudent);
module.exports = router;
