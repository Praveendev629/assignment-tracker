const { validationResult } = require('express-validator');
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');

const createAssignment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { studentId, subject, assignmentTitle, marks, submissionDate } = req.body;
    const student = await Student.findOne({ _id: studentId, createdBy: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const assignment = await Assignment.create({ studentId, subject, assignmentTitle, marks, submissionDate, createdBy: req.user._id });
    res.status(201).json({ assignment });
  } catch { res.status(500).json({ message: 'Failed to create assignment' }); }
};

const createAssignmentForAll = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { subject, assignmentTitle, marks, submissionDate } = req.body;
    const students = await Student.find({ createdBy: req.user._id });
    if (!students.length) return res.status(404).json({ message: 'No students found' });
    const docs = students.map(s => ({ studentId: s._id, subject, assignmentTitle, marks, submissionDate, createdBy: req.user._id }));
    const created = await Assignment.insertMany(docs);
    res.status(201).json({ assignments: created, count: created.length });
  } catch { res.status(500).json({ message: 'Failed to create assignments' }); }
};

const getAssignments = async (req, res) => {
  try {
    const { subject } = req.query;
    const filter = { createdBy: req.user._id };
    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    const assignments = await Assignment.find(filter).populate('studentId', 'name initial').sort({ createdAt: -1 });
    res.json({ assignments, total: assignments.length });
  } catch { res.status(500).json({ message: 'Failed to fetch assignments' }); }
};

const getAssignmentsByStudent = async (req, res) => {
  try {
    const { subject } = req.query;
    const filter = { studentId: req.params.id, createdBy: req.user._id };
    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    const assignments = await Assignment.find(filter).populate('studentId', 'name initial').sort({ createdAt: -1 });
    res.json({ assignments, total: assignments.length });
  } catch { res.status(500).json({ message: 'Failed to fetch assignments' }); }
};

const deleteAssignment = async (req, res) => {
  try {
    const a = await Assignment.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!a) return res.status(404).json({ message: 'Assignment not found' });
    await a.deleteOne();
    res.json({ message: 'Assignment deleted' });
  } catch { res.status(500).json({ message: 'Failed to delete assignment' }); }
};

module.exports = { createAssignment, createAssignmentForAll, getAssignments, getAssignmentsByStudent, deleteAssignment };
