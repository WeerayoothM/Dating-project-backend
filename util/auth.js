const router = require('express').Router();
const jwt = require('jsonwebtoken');
const db = require('../models');

function extractToken(req) {
  const headerAuth = req.headers['authorization'].split(' ');
  return headerAuth[1];
}

const auth = (req, res, next) => {
  try {
    const token = extractToken(req);
    const payload = jwt.verify(token, 'datingApp');
    db.User.findOne({ where: { id: payload.id } })
      .then((targetUser) => {
        req.user = targetUser;
        next();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: 'Should not be here.' });
      });
  } catch (err) {
    console.log(err);
    res.status(401).send('Unauthorized');
  }
};

module.exports = auth;
