const db = require("../models/");
const Op = require("sequelize").Op;

const getNextProfile = async (req, res) => {
  const target = req.user.target;
  const filter = {};
  if (target === "male") {
    filter.gender = "male";
  }
  if (target === "female") {
    filter.gender = "female";
  }
  console.log("filter", filter);
  const users = await db.User.findAll({
    where: filter,
    attributes: ["id", "name", "birthday", "gender", "motto", "lat", "long"],
    include: [
      {
        model: db.Photo,
      },
      {
        model: db.User,
        as: "Liker",
      },
      {
        model: db.User,
        as: "Liked",
      },
    ],
  });

  const filtered = users.filter((user) => {
    const find = user.Liked.find((ele) => {
      return ele.id === req.user.id
    });
    if (!find) return true;
    return false;
  });

  const length = filtered.length;
  const randIndex = Math.floor(Math.random() * length);
  const randUser = filtered[randIndex];
  res.send({ randUser });
};

const postLike = async (req, res) => {
  const likedId = req.params.id;
  const likerId = req.user.id;
  console.log(likedId, likerId)

  const find = await db.Like.findOne({
    where: {
      liker_id: likerId,
      liked_id: likedId,
    },
  });
  if (find) {
    return res.send({ error: "Already like or match" });
  }

  const like = db.Like.build({
    liker_id: likerId,
    status: "like",
    liked_id: likedId,
  });
  await like.save();

  //check if match in reverse
  const reverse = await db.Like.findOne({
    where: {
      liker_id: likedId,
      liked_id: likerId,
      status: "like",
    },
  });
  if (reverse) {
    like.status = "match";
    await like.save();
    reverse.status = "match";
    await reverse.save();
    return res.send({ status: "match" });
  }
  res.send({ message: "good luck, not match yet" });
};

const getAllMatches = async (req, res) => {
  const likerId = req.user.id;
  const findMatchedUserId = await db.Like.findAll({
    where: {
      liker_id: likerId,
      status: 'match'
    },
    attributes: ['liked_id'],
  });

  const matchedId = findMatchedUserId.reduce((acc, item) => {
    return [...acc, item.liked_id]
  }, [])
  const userMatched = await db.User.findAll({
    where: { id: matchedId },
    include: [
      {
        model: db.Photo,
      },
    ]
  })

  if (userMatched) {
    return res.send(userMatched)
  } else {
    return res.send({ message: 'Not match yet' })
  }
}

module.exports = {
  getNextProfile,
  postLike,
  getAllMatches
};
