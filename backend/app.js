var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();
var { startLeadAssignmentWatcher } = require('./services/leadAssignmentWatcher');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var leadsRouter = require('./routes/leads');
var brokersRouter = require('./routes/brokers');
var packagesRouter = require('./routes/packages');
var subAdminsRouter = require('./routes/subAdmins');
const cors = require('cors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Robust CORS setup (like your second project)
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow curl/Postman/no-origin
    return callback(null, origin); // allow browser origin
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Idempotency-Key',
    'x-fingerprint',
    'X-Fingerprint',
  ],
};
app.use(cors(corsOptions));

// MongoDB connection (update URI as needed)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB connected');
    }
    // Start change stream watcher for leads assignment
    startLeadAssignmentWatcher(mongoose.connection);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/brokers', brokersRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/sub-admins', subAdminsRouter);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Server listening on port ${port}`);
  }
});

module.exports = app;
