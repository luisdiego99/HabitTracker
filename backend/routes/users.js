const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async function(req, res, next){
  try{
    const {username, password} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({username, password: hashedPassword});
    await newUser.save();

    res.status(201).json({message: "User registered successfully"});
  }catch(error){
    console.log(error);
    res.status(500).json({erros: "Register error", "description":error.toString()})
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" }); // Generic message
    }

    // Password comparison (this works with encrypted passwords)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Token generation
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Cookie settings
    res.cookie('habitToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800000 // 7 days in ms
    });

    // Response
    res.status(200).json({ 
      message: "Login successful",
      user: { id: user._id, username: user.username }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Login failed" });
  }
});
// router.post('/login', async (req,res) => {
//   try{
//     const {username,password} = req.body;

//     const user = await User.findOne({username});
//     if(!user) {
//       return res.status(401).json({error: "User not found..."});
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if(!isMatch) {
//       return res.status(401).json({ error: "Incorrect Password..."});
//     }

//     const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET , {expiresIn:'7d'});

//     res.cookie('habitToken', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite:'strict',
//       maxAge: 7 * (24)* 60 * 60 * 1000 //Equivale a 7 dias
//     });

//     res.status(200).json({message: "Successfull Login", token});

//   }catch(error){
//     res.status(500).json({error: "Login Error "}) 
//    }
// });

module.exports = router;

