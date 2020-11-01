const db = require('../models/');

const getProfile = async (req, res) => {
    const profile = await db.User.findOne({ where: { id: req.user.id } })
    if (profile) {
        res.status(200).send({ profile });
    } else {
        res.status(404).send({ message: "Not found" });
    }
}

const getOtherProfile = async (req, res) => {
    const profile = await db.User.findOne({ where: { id: req.user.id } })
    if (profile) {
        const otherProfile = await db.User.findAll({ where: { gender: profile.target } })
        res.status(200).send({ otherProfile });
    } else {
        res.status(404).send({ message: "Not found" });
    }
}


const updateProfile = async (req, res) => {
    const targetProfile = await db.User.findOne({ where: { id: req.user.id } })
    const { name, email, birthday, gender, target, lat, long, motto } = req.body
    if (targetProfile) {
        await targetProfile.update({ name, email, birthday, gender, target, lat, long, motto })
        res.status(201).send({ message: "Update Success" })
    } else {
        res.status(404).send({ message: "Not found" })
    }
}

const deleteProfile = async (req, res) => {
    const targetProfile = await db.User.findOne({ where: { id: req.user.id } })
    if (targetProfile) {
        await targetProfile.destroy()
        res.status(201).send({ message: "Delete Success" })
    } else {
        res.status(404).send({ message: "Not found" })
    }
}

module.exports = {
    getProfile,
    updateProfile,
    deleteProfile,
    getOtherProfile
};
