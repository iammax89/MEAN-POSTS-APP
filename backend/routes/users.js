const express = require("express");
const { createNewUser, login } = require("../controllers/users");

const router = express.Router();

router.post("/signup", createNewUser);
router.post("/login", login);

module.exports = router;
