const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected');
  } catch (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectDB;

// const mongoose = require('mongoose');
// require('dotenv').config();

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Database connected');
// }).catch((err) => {
//     console.log('Error connecting to database');
// });
// module.exports = mongoose;