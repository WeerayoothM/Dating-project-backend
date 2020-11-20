const express = require('express')
const adminControllers = require('../controllers/admin')
const router = express.Router()

router.get("/users", adminControllers.getAllProfiles)
router.get("/users/:id", adminControllers.getProfilesById)
router.delete("/users/:id", adminControllers.deleteProfileById)



module.exports = router