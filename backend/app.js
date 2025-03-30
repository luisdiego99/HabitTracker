require('./config/database');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var habitsRouter = require('./routes/habits');



var app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true, // Allow cookies and credentials
}));

//Trying to add this code in app
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
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/habits', habitsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// // Load environment variables
// console.log('Loading environment variables...');
// require('dotenv').config();
// require('./config/database');

// // Import required modules
// console.log('Importing required modules...');
// const createError = require('http-errors');
// const express = require('express');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
// const cors = require('cors');
// const mongoose = require('mongoose');

// // Import routes
// console.log('Importing routes...');
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
// const habitsRouter = require('./routes/habits');

// // Initialize Express app
// console.log('Initializing Express app...');
// const app = express();

// // Connect to MongoDB
// console.log('Connecting to MongoDB...');
// const connectDB = async () => {
//   try {
//     console.log('Attempting to connect to MongoDB with URI:', process.env.MONGO_URI);
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Database connected successfully');
//   } catch (err) {
//     console.error('Error connecting to database:', err.message);
//     process.exit(1); // Exit the process with a failure code
//   }
// };

// connectDB(); // Call the function to connect to MongoDB

// // Middleware setup
// console.log('Setting up middleware...');
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow requests from this origin
//   credentials: true, // Allow cookies and credentials
// }));
// console.log('CORS middleware configured');

// app.use(logger('dev'));
// console.log('Logger middleware configured');

// app.use(express.json());
// console.log('express.json() middleware configured');

// app.use(express.urlencoded({ extended: false }));
// console.log('express.urlencoded() middleware configured');

// app.use(cookieParser());
// console.log('cookieParser() middleware configured');

// app.use(express.static(path.join(__dirname, 'public')));
// console.log('express.static() middleware configured');

// // View engine setup
// console.log('Setting up view engine...');
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// console.log('View engine configured to use Jade');

// // Routes
// console.log('Setting up routes...');
// app.use('/', indexRouter);
// console.log('Index router mounted at /');

// app.use('/users', usersRouter);
// console.log('Users router mounted at /users');

// app.use('/habits', habitsRouter);
// console.log('Habits router mounted at /habits');

// // Test route
// console.log('Setting up test route...');
// app.get('/habitos', (req, res) => {
//   console.log('Route /habitos accessed');
//   res.json({ message: 'This route is CORS-enabled!' });
// });

// // Catch 404 and forward to error handler
// console.log('Setting up 404 error handler...');
// app.use(function(req, res, next) {
//   console.log('404 Error: Route not found');
//   next(createError(404));
// });

// // Error handler
// console.log('Setting up error handler...');
// app.use(function(err, req, res, next) {
//   console.error('Error:', err.message);
//   // Set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // Render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// // Start the server
// console.log('Starting server...');
// const port = process.env.PORT || 3002;
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

// module.exports = app;
