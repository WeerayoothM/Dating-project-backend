"use strict";

var db = require('../models/');

var getProfile = function getProfile(req, res) {
  var profile;
  return regeneratorRuntime.async(function getProfile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              id: req.user.id
            },
            include: [{
              model: db.Photo
            }]
          }));

        case 2:
          profile = _context.sent;

          if (profile) {
            res.status(200).send({
              profile: profile,
              message: "Success"
            });
          } else {
            res.status(404).send({
              message: "Not found"
            });
          }

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

var getOtherProfile = function getOtherProfile(req, res) {
  var profile, otherProfile;
  return regeneratorRuntime.async(function getOtherProfile$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              id: req.user.id
            }
          }));

        case 2:
          profile = _context2.sent;

          if (!profile) {
            _context2.next = 10;
            break;
          }

          _context2.next = 6;
          return regeneratorRuntime.awrap(db.User.findAll({
            where: {
              gender: profile.target
            }
          }));

        case 6:
          otherProfile = _context2.sent;
          res.status(200).send({
            otherProfile: otherProfile
          });
          _context2.next = 11;
          break;

        case 10:
          res.status(404).send({
            message: "Not found"
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var updateProfile = function updateProfile(req, res) {
  var profile;
  return regeneratorRuntime.async(function updateProfile$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              id: req.user.id
            }
          }));

        case 2:
          profile = _context3.sent;

          if (!profile) {
            _context3.next = 9;
            break;
          }

          _context3.next = 6;
          return regeneratorRuntime.awrap(profile.update(req['body']));

        case 6:
          res.status(201).send({
            message: "Update Success"
          });
          _context3.next = 10;
          break;

        case 9:
          res.status(404).send({
            message: "Not found"
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var deleteProfile = function deleteProfile(req, res) {
  var profile;
  return regeneratorRuntime.async(function deleteProfile$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              id: req.user.id
            }
          }));

        case 2:
          profile = _context4.sent;

          if (!profile) {
            _context4.next = 9;
            break;
          }

          _context4.next = 6;
          return regeneratorRuntime.awrap(profile.destroy());

        case 6:
          res.status(201).send({
            message: "Delete Success"
          });
          _context4.next = 10;
          break;

        case 9:
          res.status(404).send({
            message: "Not found"
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var matchingProfile = function matchingProfile(req, res) {
  var profile, targetProfile, matching;
  return regeneratorRuntime.async(function matchingProfile$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              id: req.user.id
            }
          }));

        case 2:
          profile = _context5.sent;
          _context5.next = 5;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              id: req.body.targetId
            }
          }));

        case 5:
          targetProfile = _context5.sent;

          if (!(profile && targetProfile)) {
            _context5.next = 23;
            break;
          }

          _context5.next = 9;
          return regeneratorRuntime.awrap(db.Like.findOne({
            where: {
              liked_id: profile.id
            }
          }));

        case 9:
          matching = _context5.sent;

          if (!matching) {
            _context5.next = 18;
            break;
          }

          _context5.next = 13;
          return regeneratorRuntime.awrap(db.Like.create({
            liker_id: profile.id,
            liked_id: targetProfile.id,
            status: "Match"
          }));

        case 13:
          _context5.next = 15;
          return regeneratorRuntime.awrap(matching.update({
            status: "Match"
          }));

        case 15:
          res.status(201).send({
            status: "Success",
            message: "Matching Success"
          });
          _context5.next = 21;
          break;

        case 18:
          _context5.next = 20;
          return regeneratorRuntime.awrap(db.Like.create({
            liker_id: profile.id,
            liked_id: targetProfile.id,
            status: "Not Match"
          }));

        case 20:
          res.status(201).send({
            status: "Success",
            message: "Not match"
          });

        case 21:
          _context5.next = 24;
          break;

        case 23:
          res.status(404).send({
            message: "Error Matching"
          });

        case 24:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var unMatchingProfile = function unMatchingProfile(req, res) {
  var profile, targetProfile, matchingOne, matchingTwo;
  return regeneratorRuntime.async(function unMatchingProfile$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              id: req.user.id
            }
          }));

        case 2:
          profile = _context6.sent;
          _context6.next = 5;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              id: req.body.targetId
            }
          }));

        case 5:
          targetProfile = _context6.sent;

          if (!(profile && targetProfile)) {
            _context6.next = 20;
            break;
          }

          _context6.next = 9;
          return regeneratorRuntime.awrap(db.Like.findOne({
            where: {
              liked_id: profile.id,
              liker_id: targetProfile.id
            }
          }));

        case 9:
          matchingOne = _context6.sent;
          _context6.next = 12;
          return regeneratorRuntime.awrap(db.Like.findOne({
            where: {
              liked_id: targetProfile.id,
              liker_id: profile.id
            }
          }));

        case 12:
          matchingTwo = _context6.sent;
          _context6.next = 15;
          return regeneratorRuntime.awrap(matchingOne.destroy());

        case 15:
          _context6.next = 17;
          return regeneratorRuntime.awrap(matchingTwo.destroy());

        case 17:
          res.status(201).send({
            message: "Delete Success"
          });
          _context6.next = 21;
          break;

        case 20:
          res.status(404).send({
            message: "Error Matching"
          });

        case 21:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports = {
  getProfile: getProfile,
  updateProfile: updateProfile,
  deleteProfile: deleteProfile,
  getOtherProfile: getOtherProfile,
  matchingProfile: matchingProfile,
  unMatchingProfile: unMatchingProfile
};