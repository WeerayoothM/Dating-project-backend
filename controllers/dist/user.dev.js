"use strict";

var db = require("../models/");

var bcryptjs = require("bcryptjs");

var jwt = require("jsonwebtoken");

var register = function register(req, res) {
  var _req$body, name, email, birthday, gender, password, target, lat, _long, motto, imageUrl, targetUser, salt, hashedPassword, newUser;

  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, birthday = _req$body.birthday, gender = _req$body.gender, password = _req$body.password, target = _req$body.target, lat = _req$body.lat, _long = _req$body["long"], motto = _req$body.motto, imageUrl = _req$body.imageUrl;

          if (email) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).send({
            error: "no email provided"
          }));

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              email: email
            }
          }));

        case 5:
          targetUser = _context.sent;

          if (!targetUser) {
            _context.next = 11;
            break;
          }

          console.log("err");
          res.status(400).send({
            message: "User already taken"
          });
          _context.next = 24;
          break;

        case 11:
          console.log("register");
          salt = bcryptjs.genSaltSync(12);
          hashedPassword = bcryptjs.hashSync(password, salt);
          _context.next = 16;
          return regeneratorRuntime.awrap(db.User.create({
            name: name,
            email: email,
            birthday: birthday,
            gender: gender,
            target: target,
            lat: lat,
            "long": _long,
            motto: motto,
            password: hashedPassword,
            role: 0
          }));

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              email: email
            }
          }));

        case 18:
          newUser = _context.sent;
          console.log(newUser.id);

          if (!imageUrl) {
            _context.next = 23;
            break;
          }

          _context.next = 23;
          return regeneratorRuntime.awrap(db.Photo.create({
            imageUrl: imageUrl,
            user_id: newUser.id
          }));

        case 23:
          // generating random likes
          //await generateBotLikes(newUser);
          res.status(201).send({
            message: "User created"
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  });
};

var login = function login(req, res) {
  var _req$body2, email, password, targetUser, token, role, status;

  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.next = 3;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              email: email
            }
          }));

        case 3:
          targetUser = _context2.sent;

          if (targetUser) {
            if (bcryptjs.compareSync(password, targetUser.password)) {
              token = jwt.sign({
                id: targetUser.id,
                name: targetUser.name
              }, "datingApp", {
                expiresIn: 3600
              });
              role = targetUser.role;
              status = targetUser.status;
              console.log('status', status);
              res.status(200).send({
                token: token,
                role: role,
                status: status
              });
            } else {
              res.status(400).send({
                message: "Wrong password"
              });
            }
          } else {
            res.status(400).send({
              message: "Not found account"
            });
          }

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = {
  register: register,
  login: login
};

function generateBotLikes(user) {
  var target, filter, users, length, randCount, i, like;
  return regeneratorRuntime.async(function generateBotLikes$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          target = user.target;
          filter = {};

          if (target === "male") {
            filter.gender = "male";
          }

          if (target === "female") {
            filter.gender = "female";
          }

          _context3.next = 6;
          return regeneratorRuntime.awrap(db.User.findAll({
            where: filter,
            attributes: ["id", "name", "birthday", "gender", "motto"],
            include: {
              model: db.Photo
            }
          }));

        case 6:
          users = _context3.sent;
          length = users.length;
          randCount = Math.ceil(length * 0.1);

          for (i = 0; i < randCount; i++) {
            like = User.build({
              liker_id: "1",
              status: "like",
              liked_id: "2"
            });
          }

          console.log("randCount", randCount); // const randIndex = Math.floor(Math.random() * length);
          // const randUser = users[randIndex];
          // res.send({ randUser });

          console.log("generating bot likes");

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  });
}