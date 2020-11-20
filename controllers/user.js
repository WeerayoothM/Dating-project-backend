const db = require("../models/");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const {
    name,
    email,
    birthday,
    gender,
    password,
    target,
    lat,
    long,
    motto,
  } = req.body;
  const targetUser = await db.User.findOne({ where: { email } });

  if (targetUser) {
    res.status(400).send({ message: "User already taken" });
  } else {
    const salt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    await db.User.create({
      name,
      email,
      birthday,
      gender,
      target,
      lat,
      long,
      motto,
      password: hashedPassword,
    });
    res.status(201).send({ message: "User created" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const targetUser = await db.User.findOne({ where: { email } });

  if (targetUser) {
    if (bcryptjs.compareSync(password, targetUser.password)) {
      const token = jwt.sign(
        { id: targetUser.id, name: targetUser.name },
        "datingApp",
        { expiresIn: 3600 }
      );
      res.status(200).send({ token });
    } else {
      res.status(400).send({ message: "Wrong password" });
    }
  } else {
    res.status(400).send({ message: "Not found account" });
  }
};

module.exports = { register, login };
