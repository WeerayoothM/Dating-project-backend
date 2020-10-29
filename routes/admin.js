const express = require('express')
const adminControllers = require('../controllers/admin')
const router = express.Router()

router.get("/profiles", adminControllers.getAllProfiles)
router.get("/profiles/:id", adminControllers.getProfilesById)
router.delete("/profiles/:id", adminControllers.deleteProfileById)




module.exports = router