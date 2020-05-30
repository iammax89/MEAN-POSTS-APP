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

router.get("", getPosts);

router.get("/:id", getPost);

router.post("", uploadFile.single("image"), createPost);

router.delete("/:id", deletePost);

router.patch("/:id", uploadFile.single("image"), updatePost);

module.exports = router;
