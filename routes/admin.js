const express = require("express");
const adminControllers = require("../controllers/admin");
const router = express.Router();
const auth = require("../util/auth");
const checkAdmin = (req, res, next) => {
  if (req.user.role !== 1) {
    return res.status(401).send();
  }

  next();
};
router.get("/users", auth, checkAdmin, adminControllers.getAllProfiles);
router.get("/users/:id", auth, checkAdmin, adminControllers.getProfilesById);
router.delete(
  "/users/:id",
  auth,
  checkAdmin,
  adminControllers.deleteProfileById
);
router.put("/users/:id", auth, checkAdmin, adminControllers.changeStatus);

module.exports = router;
