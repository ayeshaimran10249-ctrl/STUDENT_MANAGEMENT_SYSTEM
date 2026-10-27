
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Student = require('../models/Student')

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateStudent(data, requireStatus = false) {
  const { name, email, course, status } = data

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof email !== 'string' ||
    !validEmail.test(email.trim()) ||
    typeof course !== 'string' ||
    !course.trim()
  ) {
    return 'A valid name, email, and course are required'
  }

  if (
    (requireStatus || status !== undefined) &&
    !['Active', 'Inactive'].includes(status)
  ) {
    return 'Invalid student status'
  }

  return null
}

// GET: All students
router.get('/', async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 })
    res.status(200).json(students)
  } catch (error) {
    next(error)
  }
})

// GET: Student by ID
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid student ID' })
    }

    const student = await Student.findById(req.params.id)

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.status(200).json(student)
  } catch (error) {
    next(error)
  }
})

// POST: Add a student
router.post('/', async (req, res, next) => {
  try {
    const validationError = validateStudent(req.body)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const { name, email, course, status } = req.body
    const normalizedEmail = email.trim().toLowerCase()

    const existingStudent = await Student.findOne({
      email: normalizedEmail,
    })

    if (existingStudent) {
      return res.status(409).json({ message: 'Email already exists' })
    }

    const student = await Student.create({
      name: name.trim(),
      email: normalizedEmail,
      course: course.trim(),
      status: status || 'Active',
    })

    res.status(201).json({
      message: 'Student added successfully',
      student,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' })
    }
    next(error)
  }
})

// PUT: Update a student
router.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid student ID' })
    }

    const validationError = validateStudent(req.body, true)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const { name, email, course, status } = req.body
    const normalizedEmail = email.trim().toLowerCase()

    const existingStudent = await Student.findOne({
      email: normalizedEmail,
      _id: { $ne: req.params.id },
    })

    if (existingStudent) {
      return res.status(409).json({ message: 'Email already exists' })
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        email: normalizedEmail,
        course: course.trim(),
        status,
      },
      { new: true, runValidators: true }
    )

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.status(200).json({
      message: 'Student updated successfully',
      student,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' })
    }
    next(error)
  }
})

// DELETE: Remove a student
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid student ID' })
    }

    const student = await Student.findByIdAndDelete(req.params.id)

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.status(200).json({
      message: 'Student deleted successfully',
      student,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
