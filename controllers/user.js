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
    imageUrl,
  } = req.body;

  if (!email) {
    return res.status(400).send({ error: "no email provided" });
  }

  const targetUser = await db.User.findOne({ where: { email } });

  if (targetUser) {
    console.log("err");
    res.status(400).send({ message: "User already taken" });
  } else {
    console.log("register");
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
      role: 0,
    });
    const newUser = await db.User.findOne({ where: { email } });
    if (imageUrl) {
      await db.Photo.create({ imageUrl, user_id: newUser.id });
    }
    // generating random likes
    //await generateBotLikes(newUser);
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
        process.env.SECRET_KEY,
        { expiresIn: 3600 }
      );
      const role = targetUser.role;
      const status = targetUser.status
      console.log('status', status)
      res.status(200).send({ token, role, status });

    } else {
      res.status(400).send({ message: "Wrong password" });
    }
  } else {
    res.status(400).send({ message: "Not found account" });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.userId;
  const targetUser = await db.User.findOne({
    where: { id: userId },
    include: [
      {
        model: db.Photo
      }
    ]
  });

  if (targetUser) return res.status(200).send(targetUser)
  else return res.status(404).send({ message: 'Not found user' })

}

module.exports = { register, login, getUserById };

async function generateBotLikes(user) {
  const target = user.target;
  const filter = {};
  if (target === "male") {
    filter.gender = "male";
  }
  if (target === "female") {
    filter.gender = "female";
  }
  const users = await db.User.findAll({
    where: filter,
    attributes: ["id", "name", "birthday", "gender", "motto"],
    include: {
      model: db.Photo,
    },
  });
  const length = users.length;
  const randCount = Math.ceil(length * 0.1);

  for (let i = 0; i < randCount; i++) {
    const like = User.build({ liker_id: "1", status: "like", liked_id: "2" });
  }

  console.log("randCount", randCount);
  // const randIndex = Math.floor(Math.random() * length);
  // const randUser = users[randIndex];
  // res.send({ randUser });
  console.log("generating bot likes");
}
