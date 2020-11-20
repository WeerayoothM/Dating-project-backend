const router = require('express').Router();
const { uploadImage } = require('../controllers/upload')

router.post('/', uploadImage)

module.exports = router;