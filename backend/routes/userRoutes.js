const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, deleteUser } = require("../controllers/userController");

const router = express.Router();

//user management routes
router.get("/",protect,adminOnly,getUsers); // get all users (admin only)
router.get("/:id",protect, getUserById);
//router.delete("/:id",protect,adminOnly, deleteUser); //Delete user (Admin only)

module.exports = router;