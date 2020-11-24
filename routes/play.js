const router = require('express').Router();
const playController = require('../controllers/play');
const auth = require('../util/auth');

router.get('/', auth, playController.getNextProfile);
router.post('/like/:id', auth, playController.postLike);

module.exports = router;
