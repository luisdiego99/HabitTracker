const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');


// GET all habits
router.get('/', async (req, res) => {  // Now just '/'
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving habits', error: err.message });
  }
});

// POST a new habit
router.post('/', async (req, res) => {  // Now just '/'
  try {
    const { title, description } = req.body;
    const habit = new Habit({ title, description });
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ message: 'Error creating habit', error: err.message });
  }
});

// DELETE a habit
router.delete('/:id', async (req, res) => {  // Now just '/:id'
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// TIME DIFFERENCE FUNCTIONS
const timeDifferenceInHours = (date1, date2) => {
  const differenceMs = Math.abs(date1 - date2);
  return differenceMs / (1000 * 60 * 60);
};

const timeDifferenceInDays = (date1, date2) => {
  const differenceMs = Math.abs(date1 - date2);
  return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
}


//MARK AS DONE a habit - Updated Version
router.patch('/markasdone/:id', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const now = new Date();
    const hoursSinceLastDone = habit.lastDone 
      ? timeDifferenceInHours(now, habit.lastDone)
      : Infinity; // First time marking

    if (hoursSinceLastDone < 24) {
      // Already marked today
      return res.status(400).json({ 
        message: 'Already marked today',
        canMarkAgainAt: new Date(habit.lastDone.getTime() + 24 * 60 * 60 * 1000)
      });
    }

    // Calculate if this is a streak continuation or new streak
    const isNewStreak = hoursSinceLastDone >= 24;
    
    if (isNewStreak) {
      habit.days = 1;
      habit.startedAt = now;
    } else {
      habit.days += 1;
    }

    habit.lastDone = now;
    habit.lastUpdate = now;
    await habit.save();

    res.status(200).json({ 
      message: isNewStreak ? 'New streak started' : 'Streak continued',
      days: habit.days
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//MARK AS DONE a habit - Original Version
// router.patch('/markasdone/:id', async (req, res) => {
//   try{
//     const habit = await Habit.findById(req.params.id);
//    if(timeDifferenceInHours(habit.lastDone, habit.lastUpdate) < 24){
//       habit.days = timeDifferenceInDays(habit.lastDone, habit.startedAt);
//       habit.lastUpdate = new Date();
//       habit.save();
//       res.status(200).json({message: 'Habit marked as done'});
//     }else{
//       habit.days = 1;
//       habit.lastUpdate = new Date();
//       habit.save();
//       res.status(200).json({message: 'Habit restarted'});
//     }
//   }catch(err){
//     res.status(500).json({message: 'Habit not found'});
//   }
// });


module.exports = router;// const express = require('express');
