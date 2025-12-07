const express = require('express');
const router = express.Router();
const Course = require('../../../database/models/Course');

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET course by code
router.get('/:courseCode', async (req, res) => {
  try {
    const course = await Course.findOne({ 
      courseCode: req.params.courseCode.toUpperCase() 
    });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Add a review to a course
router.post('/:courseCode/reviews', async (req, res) => {
  try {
    const { professor, semester, ratings, comment } = req.body;
    
    const course = await Course.findOne({ 
      courseCode: req.params.courseCode.toUpperCase() 
    });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    course.reviews.push({
      professor,
      semester,
      ratings,
      comment
    });
    
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET reviews for a course
router.get('/:courseCode/reviews', async (req, res) => {
  try {
    const course = await Course.findOne({ 
      courseCode: req.params.courseCode.toUpperCase() 
    });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course.reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH - Update course (add professor)
router.patch('/:courseCode', async (req, res) => {
  try {
    const { professors } = req.body;
    
    const course = await Course.findOne({ 
      courseCode: req.params.courseCode.toUpperCase() 
    });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Update professors array if provided
    if (professors) {
      course.professors = professors;
    }
    
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;