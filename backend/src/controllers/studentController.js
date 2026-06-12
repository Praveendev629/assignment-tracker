const { validationResult } = require('express-validator');
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');

const createStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, initial } = req.body;
    const existing = await Student.findOne({ name, createdBy: req.user._id });
    if (existing && !initial) return res.status(409).json({ message: 'DUPLICATE_NAME' });
    const student = await Student.create({ name, initial: initial || '', createdBy: req.user._id });
    res.status(201).json({ student });
  } catch { res.status(500).json({ message: 'Failed to create student' }); }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    const withCount = await Promise.all(students.map(async s => {
      const count = await Assignment.countDocuments({ studentId: s._id });
      return { ...s.toObject(), assignmentCount: count };
    }));
    res.json({ students: withCount, total: students.length });
  } catch { res.status(500).json({ message: 'Failed to fetch students' }); }
};

const getStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ student });
  } catch { res.status(500).json({ message: 'Failed to fetch student' }); }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await Assignment.deleteMany({ studentId: student._id });
    await student.deleteOne();
    res.json({ message: 'Student and all assignments deleted' });
  } catch { res.status(500).json({ message: 'Failed to delete student' }); }
};

module.exports = { createStudent, getStudents, getStudent, deleteStudent };
