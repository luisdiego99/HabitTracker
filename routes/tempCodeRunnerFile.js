// GET all habits
router.get('/allHabits', async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving habits', error: err.message });
  }
});