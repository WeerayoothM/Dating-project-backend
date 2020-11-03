const router = require('express').Router();
const playController = require('../controllers/play');

router.get('/', playController.getNextProfile);
router.post('/like/:id', playController.postLike);

module.exports = router;
