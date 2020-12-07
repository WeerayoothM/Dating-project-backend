const db = require('../models/');
const { param } = require('../routes/play');

const getProfile = async (req, res) => {
    const profile = await db.User.findOne({
        where: { id: req.user.id },
        include: [
            {
                model: db.Photo
            }
        ]
    });
    if (profile) {
        res.status(200).send({ profile, message: "Success" });
    } else {
        res.status(404).send({ message: "Not found" });
    }
}

const deleteImageProfile = async (req, res) => {
    console.log(req.params.id)
    const imageProfile = await db.Photo.findOne({
        where: { id: req.params.id }
    });
    if (imageProfile) {
        await imageProfile.destroy();
        res.status(204).send({ imageProfile, message: "Success" });
    } else {
        res.status(404).send({ message: "Not found" });
    }
}

const uploadImageProfile = async (req, res) => {
    const { imageUrl } = req.body;
    if (imageUrl) {
        const response = await db.Photo.create({ imageUrl, user_id: req.user.id });
        console.log(response.id)
        res.status(201).send({ id: response.id , url :imageUrl  });
    } else {
        res.status(400).send({ message: 'error' })
    }
};

const getOtherProfile = async (req, res) => {
    const profile = await db.User.findOne({ where: { id: req.user.id } });
    if (profile) {
        const otherProfile = await db.User.findAll({ where: { gender: profile.target } });
        res.status(200).send({ otherProfile });
    } else {
        res.status(404).send({ message: "Not found" });
    }
}

const updateProfile = async (req, res) => {
    const profile = await db.User.findOne({ where: { id: req.user.id } });
    if (profile) {
        await profile.update(req['body']);
        res.status(201).send({ message: "Update Success" });
    } else {
        res.status(404).send({ message: "Not found" });
    }
}

const deleteProfile = async (req, res) => {
    const profile = await db.User.findOne({ where: { id: req.user.id } });
    if (profile) {
        await profile.destroy();
        res.status(201).send({ message: "Delete Success" });
    } else {
        res.status(404).send({ message: "Not found" });
    }
}

const matchingProfile = async (req, res) => {
    const profile = await db.User.findOne({ where: { id: req.user.id } });
    const targetProfile = await db.User.findOne({ where: { id: req.body.targetId } });
    if (profile && targetProfile) {
        const matching = await db.Like.findOne({ where: { liked_id: profile.id } });
        if (matching) {
            await db.Like.create({ liker_id: profile.id, liked_id: targetProfile.id, status: "Match" });
            await matching.update({ status: "Match" });
            res.status(201).send({ status: "Success", message: "Matching Success" });
        } else {
            await db.Like.create({ liker_id: profile.id, liked_id: targetProfile.id, status: "Not Match" });
            res.status(201).send({ status: "Success", message: "Not match" });
        }
    } else {
        res.status(404).send({ message: "Error Matching" });
    }
}

const unMatchingProfile = async (req, res) => {
    const profile = await db.User.findOne({ where: { id: req.user.id } });
    const targetProfile = await db.User.findOne({ where: { id: req.body.targetId } });
    if (profile && targetProfile) {
        const matchingOne = await db.Like.findOne({ where: { liked_id: profile.id, liker_id: targetProfile.id } });
        const matchingTwo = await db.Like.findOne({ where: { liked_id: targetProfile.id, liker_id: profile.id } });
        await matchingOne.destroy();
        await matchingTwo.destroy();
        res.status(201).send({ message: "Delete Success" });
    } else {
        res.status(404).send({ message: "Error Matching" });
    }
}

module.exports = {
    getProfile,
    updateProfile,
    deleteProfile,
    getOtherProfile,
    matchingProfile,
    unMatchingProfile,
    deleteImageProfile,
    uploadImageProfile
};
