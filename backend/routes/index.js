const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Import mongoose
const Habit = require('../models/Habit'); // Import the Habit model
const connectDB = require('../config/database'); // Import the connectDB function


// Connect to MongoDB
connectDB();

// Landing page
router.get('/', async (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// GET all habits
router.get('/habits', async (req, res, next) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving habits', error: err.message });
  }
});

// Test route
router.get('/test',  (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// POST a new habit
router.post('/habits', async (req, res) => {
  try {
    const { title, description } = req.body;
    const habit = new Habit({ title, description });
    await habit.save();
    res.status(201).json(habit); // Use 201 for resource creation
  } catch (err) {
    res.status(400).json({ message: 'Error creating habit', error: err.message });
  }
});

// DELETE a habit
router.delete('/habits/:id', async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.status(204).send(); // Use 204 for successful deletion with no content
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
// var express = require('express');
// var router = express.Router();
// const mongoose = require('mongoose'); // Import mongoose
// const Habit = require('../models/Habit'); // Import the Habit model
// const connectDB = require('../config/database'); // Import the connectDB function

// // Connect to MongoDB
// connectDB();

// // Default route (Welcome to Express)
// // router.get('/', function(req, res, next) {
// //   res.render('index', {title: 'Express'});
// // });

// //Landing page
// router.get('/', function(req, res, next){
//   res.render('index', { title: 'Express'});
// });

// //GET all habits
// router.get('/habits', async (req, res, next) => {
//   try {
//     const habits = await Habit.find();
//     res.json(habits);
//   } catch (err) {
//     res.status(500).json({ message: 'Error retrieving habits', error: err.message });
//   }
// });

// router.get('/test', function(req, res, next) {
//   res.json({ message: 'Backend is working!' });
// });

// // POST a new habit
// router.post('/habits', async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const habit = new Habit({ title, description });
//     await habit.save();
//     res.status(201).json(habit); // Use 201 for resource creation
//   } catch (err) {
//     res.status(400).json({ message: 'Error creating habit', error: err.message });
//   }
// });

// // DELETE a habit
// router.delete('/habits/:id', async (req, res) => {
//   try {
//     const habit = await Habit.findByIdAndDelete(req.params.id);
//     if (!habit) {
//       return res.status(404).json({ message: 'Habit not found' });
//     }
//     res.status(204).send(); // Use 204 for successful deletion with no content
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// module.exports = router;



