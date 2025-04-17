require('dotenv').config(); // Ensure environment variables are loaded
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose'); // Missing in your original

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const habitsRouter = require('./routes/habits');

const app = express();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected');
  } catch (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
};
connectDB(); // Actually call the function

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/habits', habitsRouter);

// Debug: Log registered routes (optional)
console.log('Registered Routes:');
app._router.stack.forEach((r) => {
  if (r.route?.path) {
    console.log(`${Object.keys(r.route.methods)[0]} ${r.route.path}`);
  } else if (r.name === 'router') {
    r.handle.stack.forEach((s) => {
      if (s.route?.path) {
        console.log(`${Object.keys(s.route.methods)[0]} ${r.regexp.source}${s.route.path}`);
      }
    });
  }
});

// Error handlers
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message }); // Return JSON instead of rendering views
});

module.exports = app; 
// Only export app
// require('./config/database');
// var createError = require('http-errors');
// const express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const cors = require('cors');

// var indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
// const habitsRouter = require('./routes/habits');



// const app = express();
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow requests from this origin
//   credentials: true, // Allow cookies and credentials
// }));

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('Database connected');
//   } catch (err) {
//     console.error('Error connecting to database:', err.message);
//     process.exit(1); // Exit the process with a failure code
//   }
// };

// module.exports = connectDB;
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/habits', habitsRouter);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// console.log('Registered Routes:');
// app._router.stack.forEach((r) => {
//   if (r.route?.path) {
//     console.log(`${Object.keys(r.route.methods)[0]} ${r.route.path}`);
//   } else if (r.name === 'router') {
//     r.handle.stack.forEach((s) => {
//       if (s.route?.path) {
//         console.log(`${Object.keys(s.route.methods)[0]} ${r.regexp.source}${s.route.path}`);
//       }
//     });
//   }
// });
// module.exports = app;
