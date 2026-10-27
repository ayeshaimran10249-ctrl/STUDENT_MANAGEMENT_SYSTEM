
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Course = require('../models/Course');

const defaultCourses = [
  {
    name: 'Web Development',
    description: 'Learn frontend and backend web development.',
  },
  {
    name: 'Graphic Design',
    description: 'Learn visual design and creative tools.',
  },
  {
    name: 'UI/UX Design',
    description: 'Learn user interface and user experience design.',
  },
  {
    name: 'Python Programming',
    description: 'Learn Python programming fundamentals.',
  },
];

// GET: All courses
router.get('/', async (req, res, next) => {
  try {
    let courses = await Course.find().sort({ createdAt: -1 });

    // Add default courses if the collection is empty
    if (courses.length === 0) {
      courses = await Course.insertMany(defaultCourses);
    }

    res.status(200).json(
      courses.map((course) => ({
        id: course._id.toString(),
        name: course.name,
        description: course.description,
        duration: course.duration,
        status: course.status,
      }))
    );
  } catch (error) {
    next(error);
  }
});

// POST: Add a course
router.post('/', async (req, res, next) => {
  try {
    const { name, description, duration, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Course name is required',
      });
    }

    const course = await Course.create({
      name: name.trim(),
      description: description || '',
      duration: duration || '',
      status: status || 'Active',
    });

    res.status(201).json({
      message: 'Course added successfully',
      course: {
        id: course._id.toString(),
        name: course.name,
        description: course.description,
        duration: course.duration,
        status: course.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT: Update a course
router.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const { name, description, duration, status } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim(),
        description,
        duration,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE: Remove a course
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
