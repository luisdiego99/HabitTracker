const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided in headers");
    return res.status(401).json({ error: "Acceso denegado. Token no proporcionado!" });
  }
  
  const token = authHeader.split(" ")[1]; // separa "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contiene userId
    next();
  } catch (error) {
    console.error("Token inválido:", error.message);
    res.status(403).json({ error: "Token inválido o expirado" });
  }
};

// Ruta para testear autenticación
router.get('/test-auth', authenticateToken, (req, res) => {
  res.json({ message: "Autenticación exitosa", user: req.user });
});

// GET todos los hábitos del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const habits = await Habit.find({ userId: new mongoose.Types.ObjectId(userId) });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener hábitos', error: err.message });
  }
});

// POST: crear un nuevo hábito
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const habit = new Habit({ title, description, userId });
    await habit.save();

    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear hábito', error: err.message });
  }
});

// DELETE: eliminar hábito por ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Hábito no encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor', error: err.message });
  }
});

// PATCH: marcar hábito como realizado
router.patch('/markasdone/:id', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Hábito no encontrado' });

    const now = new Date();
    const hoursSinceLastDone = habit.lastDone
      ? Math.abs(now - habit.lastDone) / (1000 * 60 * 60)
      : Infinity;

    if (hoursSinceLastDone < 24) {
      return res.status(400).json({
        message: 'Ya marcado hoy',
        canMarkAgainAt: new Date(habit.lastDone.getTime() + 24 * 60 * 60 * 1000)
      });
    }

    const isNewStreak = hoursSinceLastDone >= 48;

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
      message: isNewStreak ? 'Nueva racha iniciada' : 'Racha continuada',
      days: habit.days,
      _id: habit._id
    });

  } catch (err) {
    res.status(500).json({ message: 'Error del servidor', error: err.message });
  }
});

module.exports = router;


