require('dotenv').config();
const express = require("express");
const app = express();
const db = require('./models');
const cors = require('cors');
// const socket = require('socket.io')

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const playRoutes = require('./routes/play');
const profileRoutes = require('./routes/profile');
const uploadRoutes = require('./routes/upload');
const fileUpload = require('express-fileupload');
const cloudinaryRoutes = require('./routes/cloudinary');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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

const server = app.listen(process.env.PORT || 5555, () => {
  console.log(`Server is running at port: ${process.env.PORT}`)
})

//* Initialize socket for the server
const socket = require('socket.io')
const io = socket(server);
const jwt = require("jsonwebtoken");

// io.use(async (socket, next) => {
//   try {
//     const token = socket.handshake.query.token;
//     const payload = await jwt.verify(token, process.env.SECRET_KEY);
//     socket.userId = payload.id;
//     // socket.userName = payload.username
//     next();
//   } catch (err) {}
// });

io.on('connection', socket => {
  // console.log('user connect')

  // เมื่อ Client ตัดการเชื่อมต่อ
  // socket.on('disconnect', () => {
  // console.log('user disconnected')
  // })

  // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime
  socket.on('sent_message', function (data) {
    console.log(data.message, data.userId)
    io.sockets.emit('new_message', { message: data.message, userId: data.userId })
  })
})
