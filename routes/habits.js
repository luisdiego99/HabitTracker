const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// POST a new habit
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const habit = new Habit({ title, description });
    await habit.save();
    res.status(201).json(habit); // Use 201 for resource creation
  } catch (err) {
    res.status(400).json({ message: 'Error creating habit', error: err.message });
  }
});

module.exports = router;