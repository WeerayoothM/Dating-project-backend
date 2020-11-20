const db = require('../models/');

const getNextProfile = async (req, res) => {
  const users = await db.User.findAll({
    attributes: ['id', 'name', 'birthday', 'gender', 'motto'],
    include: {
      model: db.Photo,
    },
  });
  const length = users.length;
  const randIndex = Math.floor(Math.random() * length);
  const randUser = users[randIndex];
  res.send({ randUser });
};

const postLike = async (req, res) => {
  res.send({ message: 'post like' });
};

module.exports = {
  getNextProfile,
  postLike,
};
