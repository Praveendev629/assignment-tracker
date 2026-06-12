require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const rateLimiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const assignmentRoutes = require('./routes/assignments');

const app = express();

// Required for Vercel / reverse proxy deployments
app.set('trust proxy', 1);

connectDB();

app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));
app.use(rateLimiter);

app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/assignments', assignmentRoutes);

app.get('/', (req, res) => res.json({ status: 'Assignment Tracker API Running', version: '1.0.0' }));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
