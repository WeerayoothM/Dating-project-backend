"use strict";

require('dotenv').config();

var express = require("express");

var app = express();

var db = require('./models');

var cors = require('cors');

var userRoutes = require('./routes/user');

var adminRoutes = require('./routes/admin');

var playRoutes = require('./routes/play');

var profileRoutes = require('./routes/profile');

var uploadRoutes = require('./routes/upload');

var fileUpload = require('express-fileupload');

var cloudinaryRoutes = require('./routes/cloudinary');

app.use(cors());
app.use(express.json({
  limit: '50mb'
}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(express["static"]("upload-files"));
app.use(fileUpload());
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/play', playRoutes);
app.use('/profile', profileRoutes);
app.use('/upload', cloudinaryRoutes);
app.use('/uploads', uploadRoutes);
db.sequelize.sync({
  alter: false,
  force: false
}).then(function () {
  console.log("Database is running");
});
var server = app.listen(process.env.PORT || 5555, function () {
  console.log("Server is running at port: ".concat(process.env.PORT));
}); //* Initialize socket for the server

var socket = require('socket.io');

var io = socket(server);

var jwt = require("jsonwebtoken");

io.use(function _callee(socket, next) {
  var token, payload;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = socket.handshake.query.token;
          _context.next = 4;
          return regeneratorRuntime.awrap(jwt.verify(token, process.env.SECRET_KEY));

        case 4:
          payload = _context.sent;
          socket.userId = payload.id; // socket.userName = payload.username

          next();
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          socket.emit('token-expired', {
            message: 'token-expired'
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
io.on('connection', function (socket) {
  // เมื่อ Client ตัดการเชื่อมต่อ
  socket.on('disconnect', function () {
    console.log('user disconnected');
  }); // fetch chat data when client join chat room

  socket.on('join', function _callee2(data) {
    var participants, existingRoom, newRoom, roomData;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            participants = data.userId < data.oppositeUserId ? "".concat(data.userId, "-").concat(data.oppositeUserId) : "".concat(data.oppositeUserId, "-").concat(data.userId);
            _context2.next = 3;
            return regeneratorRuntime.awrap(db.Room.findOne({
              where: {
                participants: participants
              }
            }));

          case 3:
            existingRoom = _context2.sent;

            if (!existingRoom) {
              _context2.next = 8;
              break;
            }

            socket.roomId = existingRoom.id;
            _context2.next = 12;
            break;

          case 8:
            _context2.next = 10;
            return regeneratorRuntime.awrap(db.Room.create({
              participants: participants
            }));

          case 10:
            newRoom = _context2.sent;
            socket.roomId = newRoom.id;

          case 12:
            socket.join("".concat(socket.roomId));
            _context2.next = 15;
            return regeneratorRuntime.awrap(db.ChatLine.findAll({
              where: {
                room_id: socket.roomId
              },
              include: [{
                model: db.User
              }]
            }));

          case 15:
            roomData = _context2.sent;
            io["in"]("".concat(socket.roomId)).emit('room-data', {
              roomData: roomData,
              chatRoomId: socket.roomId
            });

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    });
  }); // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime

  socket.on('sent_message', function _callee3(data) {
    var newMessage;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log(data.message, data.userId);
            _context3.next = 3;
            return regeneratorRuntime.awrap(db.ChatLine.create({
              message: data.message,
              room_id: socket.roomId,
              user_id: data.userId
            }));

          case 3:
            _context3.next = 5;
            return regeneratorRuntime.awrap(db.ChatLine.findAll({
              where: {
                room_id: socket.roomId
              },
              include: [{
                model: db.User
              }]
            }));

          case 5:
            newMessage = _context3.sent;
            io["in"]("".concat(socket.roomId)).emit('new_message', {
              newMessage: newMessage,
              chatRoomId: socket.roomId
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
});