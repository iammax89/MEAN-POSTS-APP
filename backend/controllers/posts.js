const fs = require("fs");
const mongoose = require("mongoose");
const Post = require("../models/post");
const User = require("../models/user");
const getPost = async (req, res, next) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: `Could not fetch post ${id}.` });
  }
};

const getPosts = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  try {
    const posts = await postQuery;
    const total = await Post.count();
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts,
      total,
    });
  } catch (err) {
    res.status(500).json({ message: "Could not connect to database." });
  }
};

const createPost = async (req, res, next) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.file.path,
      creator: req.userData.userId,
    });
    let user;
    try {
      user = await User.findById(req.userData.userId);
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
    if (!user) {
      res.status(404).json({
        message: "Could not find user for the provided id",
      });
    }
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
      await post.save({ session: session });
      user.posts.push(post);
      await user.save({ session: session });
      await session.commitTransaction();
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
    res.status(201).json({ message: "Post created successfully!", post });
  } catch (error) {
    res.status(500).json({
      message: "Creating a post failed!",
    });
  }
};

const deletePost = async (req, res, next) => {
  const id = req.params.id;
  let post;
  try {
    post = await Post.findById(id).populate("creator");
  } catch (error) {
    res.status(500).json({
      error: error.error,
    });
  }
  if (!post) {
    res.status(404).json({
      message: "Could not find a post for the provided id.",
    });
  }
  if (post.creator.id !== req.userData.userId) {
    return res.status(401).json({
      message: "You are not allowed to delete this post.",
    });
  }
  const imagePath = post.imageUrl;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await post.remove({ session: session });
    post.creator.posts.pull(post);
    await post.creator.save({ session: session });
    await session.commitTransaction();
    fs.unlink(imagePath, (err) => console.log(err));
  } catch (error) {
    res.status(500).json({
      message: `Couil not delete Post ${id}. Please try agian.`,
    });
  }

  res.status(200).json({ message: `Post ${id} successfully deleted.` });
};

const updatePost = async (req, res, next) => {
  const id = req.params.id;
  let post;
  try {
    post = await Post.findById(id).populate("creator");
    if (post.creator.id !== req.userData.userId) {
      return res.status(401).json({
        message: "You are not allowed to edit this post.",
      });
    }
  } catch (error) {
    res.json({ error: error.error });
  }
  const imagePath = post.imageUrl;
  const editedPost = {
    title: req.body.title,
    content: req.body.content,
  };
  if (req.file) {
    editedPost.imageUrl = req.file.path;
  }
  try {
    await Post.updateOne({ _id: id }, editedPost);
    if (req.file) {
      fs.unlink(imagePath, (err) => console.log(err));
    }
    res.status(201).json({ message: "Successfully updated" });
  } catch (error) {
    res.json({ message: "Could not update the post." });
  }
};

exports.getPost = getPost;
exports.getPosts = getPosts;
exports.createPost = createPost;
exports.deletePost = deletePost;
exports.updatePost = updatePost;
