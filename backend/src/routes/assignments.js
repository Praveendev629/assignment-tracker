const express = require('express');
const router = express.Router();
const { createAssignment, createAssignmentForAll, getAssignments, getAssignmentsByStudent, deleteAssignment } = require('../controllers/assignmentController');
const { verifyToken } = require('../middleware/auth');
const { body } = require('express-validator');

const v = [body('subject').notEmpty().trim(), body('assignmentTitle').notEmpty().trim(), body('marks').isNumeric(), body('submissionDate').isISO8601()];
router.post('/', verifyToken, [body('studentId').notEmpty(), ...v], createAssignment);
router.post('/all', verifyToken, v, createAssignmentForAll);
router.get('/', verifyToken, getAssignments);
router.get('/student/:id', verifyToken, getAssignmentsByStudent);
router.delete('/:id', verifyToken, deleteAssignment);
module.exports = router;
