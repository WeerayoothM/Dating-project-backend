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
const socket = require('socket.io');
const io = socket(server);
const jwt = require("jsonwebtoken");

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.SECRET_KEY);
    socket.userId = payload.id;
    // socket.userName = payload.username
    next();
  } catch (err) {
    socket.emit('token-expired', { message: 'token-expired' });
  }
});

io.on('connection', socket => {

  // เมื่อ Client ตัดการเชื่อมต่อ
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  // socket.join('room1')

  // fetch chat data when client join chat room
  socket.on('join', async (data) => {
    const participants = data.userId < data.oppositeUserId ? `${data.userId}-${data.oppositeUserId}` : `${data.oppositeUserId}-${data.userId}`

    const existingRoom = await db.Room.findOne({ where: { participants } });
    if (existingRoom) {
      socket.roomId = existingRoom.id
    } else {
      const newRoom = await db.Room.create({ participants })
      socket.roomId = newRoom.id
    }
    socket.leaveAll()
    socket.join(`${socket.roomId}`);

    const roomData = await db.ChatLine.findAll({
      where: { room_id: socket.roomId },
      include: [
        {
          model: db.User
        }
      ]
    })
    io.in(`${socket.roomId}`).emit('room-data', { roomData, chatRoomId: socket.roomId })
  })

  // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime
  socket.on('sent_message', async (data) => {
    console.log(data.message, data.userId)
    await db.ChatLine.create({ message: data.message, room_id: socket.roomId, user_id: data.userId })

    const newMessage = await db.ChatLine.findAll({
      where: { room_id: socket.roomId },
      include: [
        {
          model: db.User
        }
      ]
    })

    io.in(`${socket.roomId}`).emit('new_message', { newMessage, chatRoomId: socket.roomId })
  })

  // handle the typing message event
  socket.on('typing', data => {
    socket.to(`${socket.roomId}`).emit('typing', { userId: socket.userId })
  })
})
