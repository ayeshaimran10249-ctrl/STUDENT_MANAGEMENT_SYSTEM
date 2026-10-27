
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

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Student Management API is running!' })
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

// Connect to MongoDB, then start the server
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('MongoDB connected successfully!')

//     app.listen(PORT, () => {
//       console.log(`Server running at http://localhost:${PORT}`)
//     })
//   })
//   .catch((error) => {
//     console.error('MongoDB connection failed:', error.message)
//     process.exit(1)
//   })
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    console.log('Database name:', mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });