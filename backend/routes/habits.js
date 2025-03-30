const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// TIME DIFFERENCE FUNCTIONS
const timeDifferenceInHours = (date1, date2) => {
  const differenceMs = Math.abs(date1 - date2);
  return differenceMs / (1000 * 60 * 60);
};

const timeDifferenceInDays = (date1, date2) => {
  const differenceMs = Math.abs(date1 - date2);
  return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
}
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


// MARK AS DONE a habit
router.patch('/habits/markasdone/:id', async (req, res) => {
  try{
    const habit = await Habit.findById(req.params.id);
   if(timeDifferenceInHours(habit.lastDone, habit.lastUpdate) < 24){
      habit.days = timeDifferenceInDays(habit.lastDone, habit.startedAt);
      habit.lastUpdate = new Date();
      habit.save();
      res.status(200).json({message: 'Habit marked as done'});
    }else{
      habit.days = 1;
      habit.lastUpdate = new Date();
      habit.save();
      res.status(200).json({message: 'Habit restarted'});
    }
  }catch(err){
    res.status(500).json({message: 'Habit not found'});
  }
});

module.exports = router;