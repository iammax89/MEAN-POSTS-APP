const Post = require("../models/post");

const getPost = async (req, res, next) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    throw new Error("Something went wrong please try again.");
  }
};

const getPosts = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  console.log(req.query);
  try {
    const posts = await postQuery;
    const total = await Post.count();
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts,
      total,
    });
  } catch (err) {
    throw new Error("Could not connect to database.");
  }
};

const createPost = async (req, res, next) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.file.path,
    });
    await post.save();
    res.status(201).json({ message: "Success!!!", post });
  } catch (error) {
    throw new Error("Something went wrong, please try agian!");
  }
};

const deletePost = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Post.findOneAndDelete({ _id: id });
    res.status(200).json({ message: `Post ${id} successfully deleted.` });
  } catch (error) {
    throw new Error("Something went wrong please try again.");
  }
};

const updatePost = async (req, res, next) => {
  const id = req.params.id;
  const post = {
    title: req.body.title,
    content: req.body.content,
  };
  if (req.file) {
    post.imageUrl = req.file.path;
  }
  try {
    await Post.updateOne({ _id: id }, post);
    res.status(201).json({ message: "Successfully updated" });
  } catch (error) {
    throw new Error("Something went wrong please try again.");
  }
};

exports.getPost = getPost;
exports.getPosts = getPosts;
exports.createPost = createPost;
exports.deletePost = deletePost;
exports.updatePost = updatePost;
