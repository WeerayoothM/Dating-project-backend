//API
const Sequelize = require("sequelize");
const db = require("../models");
const getAllProfiles = async (req, res) => {
  const name = req.query.name;
  const Op = Sequelize.Op;
  console.log(name);
  let query = {};
  if (name) {
    query = {
      where: { name: { [Op.like]: `%${name}%` } },
    };
  }
  const allUser = await db.User.findAll(query);
  res.status(200).send(allUser);
};

const getProfilesById = async (req, res) => {
  const user = await db.User.findOne({ where: { id: req.params.id } });

  if (user === null) {
    res.status(404).send({ message: "user id not found" });
  } else {
    res.status(200).send(user);
  }
};
const deleteProfileById = async (req, res) => {
  console.log("req.params.id", req.params.id);
  const targetUser = await db.User.findOne({ where: { id: req.params.id } });
  console.log("targetUser", targetUser);
  if (targetUser) {
    await targetUser.destroy();
    res.status(200).send({ message: "deleted" });
  } else {
    res.status(404).send({ message: "Not found" });
  }
  res.send(targetUser);
};
const changeStatus = async (req, res) => {
  console.log("req.params.id", req.params.id);
  const targetUser = await db.User.findOne({ where: { id: req.params.id } });
  console.log("targetUser", targetUser);
  if (targetUser) {
    const newStatus = targetUser.status ?  0:1
    targetUser.status = newStatus 
    await targetUser.save();
    res.status(200).send({ message: "updated" });
  } else {
    res.status(404).send({ message: "id not found" });
  }
  res.send(targetUser);
};

module.exports = { getAllProfiles, getProfilesById, deleteProfileById, changeStatus };
