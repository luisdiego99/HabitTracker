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

    const isNewStreak = hoursSinceLastDone >= 48; // más de 2 días rompe la racha

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
      days: habit.days
    });

  } catch (err) {
    res.status(500).json({ message: 'Error del servidor', error: err.message });
  }
});

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const Habit = require('../models/Habit');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
// const token = localStorage.getItem("token");

// const authenticateToken = (req, res, next) => {
//   const token = req.header('Authorization');
//   if(!token){
//     console.log("No token provided in headers"); // Debug
//     return res.status(401).json({error: "Acceso denegado. Token no proporcionado"});
//   }

//   try{
//     const tokenWithoutBearer = token.replace("Bearer ","").trim();
//     const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   }catch(error){
//     console.error(error);
//     res.status(403).json({error:"Token invalido o expirado"})
//   }
// };

// router.get('/test-auth', authenticateToken, (req, res) => {
//   res.json({ message: "This should require auth!" });
// });

// // GET all habits
// router.get('/', authenticateToken, async (req, res) => {  
//   try {
//     let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({message: "Error retrieving habits"});
//     const habits = await Habit.find({'userId':new mongoose.Types.ObjectId(userId)});
//     res.json(habits);
//   } catch (err) {
//     res.status(500).json({ message: 'Error retrieving habits', error: err.message });
//   }
// });

// // POST a new habit
// router.post('/', authenticateToken, async (req, res) => { 
//   try {
//     const { title, description } = req.body;
//     let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({message: "Error adding habits"});
//     userId = new mongoose.Types.ObjectId(userId);
//     const habit = new Habit({ title, description, userId });
//     await habit.save();
//     res.status(201).json(habit);
//   } catch (err) {
//     res.status(400).json({ message: 'Error creating habit', error: err.message });
//   }
// });

// // DELETE a habit
// router.delete('/:id', authenticateToken, async (req, res) => {  // Now just '/:id'
//   try {
//     const habit = await Habit.findByIdAndDelete(req.params.id);
//     if (!habit) return res.status(404).json({ message: 'Habit not found' });
//     res.status(204).send();
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // TIME DIFFERENCE FUNCTIONS
// const timeDifferenceInHours = (date1, date2) => {
//   const differenceMs = Math.abs(date1 - date2);
//   return differenceMs / (1000 * 60 * 60);
// };

// const timeDifferenceInDays = (date1, date2) => {
//   const differenceMs = Math.abs(date1 - date2);
//   return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
// }


// //MARK AS DONE a habit - Updated Version
// router.patch('/markasdone/:id', authenticateToken, async (req, res) => {
//   try {
//     const habit = await Habit.findById(req.params.id);
//     if (!habit) {
//       return res.status(404).json({ message: 'Habit not found' });
//     }

//     const now = new Date();
//     const hoursSinceLastDone = habit.lastDone 
//       ? timeDifferenceInHours(now, habit.lastDone)
//       : Infinity; // First time marking

//     if (hoursSinceLastDone < 24) {
//       // Already marked today
//       return res.status(400).json({ 
//         message: 'Already marked today',
//         canMarkAgainAt: new Date(habit.lastDone.getTime() + 24 * 60 * 60 * 1000)
//       });
//     }

//     // Calculate if this is a streak continuation or new streak
//     const isNewStreak = hoursSinceLastDone >= 24;
    
//     if (isNewStreak) {
//       habit.days = 1;
//       habit.startedAt = now;
//     } else {
//       habit.days += 1;
//     }

//     habit.lastDone = now;
//     habit.lastUpdate = now;
//     await habit.save();

//     res.status(200).json({ 
//       message: isNewStreak ? 'New streak started' : 'Streak continued',
//       days: habit.days
//     });

//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });


// module.exports = router;// const express = require('express');
