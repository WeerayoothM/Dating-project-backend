const router = require('express').Router();
const userControllers = require('../controllers/user');
const auth = require("../util/auth");

router.post('/login', userControllers.login);
router.post('/register', userControllers.register);
router.get("/:userId", auth, userControllers.getUserById);

module.exports = router;
