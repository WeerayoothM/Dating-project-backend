const router = require('express').Router();
const { uploadImage } = require('../controllers/cloudinary')

router.post('/', uploadImage)

module.exports = router;