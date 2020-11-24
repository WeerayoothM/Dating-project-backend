"use strict";

var express = require('express');

var app = express();

var db = require('./models');

var cors = require('cors');

var userRoutes = require('./routes/user');

var adminRoutes = require('./routes/admin');

var playRoutes = require('./routes/play');

var profileRoutes = require('./routes/profile');

var uploadRoutes = require('./routes/upload');

var fileUpload = require('express-fileupload');

app.use(cors());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(express["static"]("upload-files"));
app.use(fileUpload());
app.use('/auth', userRoutes);
app.use('/admin', adminRoutes);
app.use('/play', playRoutes);
app.use('/profile', profileRoutes);
app.use('/uploads', uploadRoutes);
app.listen(5555, function () {
  return console.log('server is running on port 5555');
});
db.sequelize.sync({
  force: false
}).then(function () {
  console.log('Database is running');
});