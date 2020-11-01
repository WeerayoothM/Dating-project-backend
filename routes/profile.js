const router = require('express').Router();
const profileControllers = require('../controllers/profile');
const auth = require('../util/auth')

router.get('/',auth, profileControllers.getProfile);
router.put('/',auth, profileControllers.updateProfile);
router.delete('/',auth, profileControllers.deleteProfile);

router.get('/other',auth,profileControllers.getOtherProfile);
router.post('/matching',auth,profileControllers.matchingProfile);
module.exports = router;