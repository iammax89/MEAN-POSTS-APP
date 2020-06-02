const express = require("express");
const router = express.Router();
const {
  getPosts,
  createPost,
  deletePost,
  getPost,
  updatePost,
} = require("../controllers/posts");
const uploadFile = require("../middleware/file-upload");
const checkAuth = require("../middleware/auth");

router.get("", getPosts);

router.get("/:id", getPost);

router.post("", checkAuth, uploadFile.single("image"), createPost);

router.delete("/:id", checkAuth, deletePost);

router.patch("/:id", checkAuth, uploadFile.single("image"), updatePost);

module.exports = router;
