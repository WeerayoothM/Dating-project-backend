require('dotenv').config();
const express = require("express");
const app = express();
const db = require('./models');
const cors = require('cors');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const playRoutes = require('./routes/play');
const profileRoutes = require('./routes/profile');
const uploadRoutes = require('./routes/upload');
const fileUpload = require('express-fileupload');
const cloudinaryRoutes = require('./routes/cloudinary');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(express.static("upload-files"));
app.use(fileUpload());

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/play', playRoutes);
app.use('/profile', profileRoutes);
app.use('/upload', cloudinaryRoutes);
app.use('/uploads', uploadRoutes);

db.sequelize.sync({ alter: false, force: false }).then(() => {
  console.log("Database is running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port: ${process.env.PORT}`)
})