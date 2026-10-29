
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const studentsRouter = require('./routes/students')
const coursesRouter = require('./routes/courses')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
// MongoDB connection
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI)
    }
    next()
  } catch (error) {
    next(error)
  }
})

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Student Management API is running!' })
})
// MongoDB connection test
app.get('/test-db', async (req, res) => {
  try {
    const result = await mongoose.connection.db.admin().ping()
    res.json({ message: 'MongoDB connected', result })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
// API routes
app.use('/api/students', studentsRouter)
app.use('/api/courses', coursesRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})


if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;