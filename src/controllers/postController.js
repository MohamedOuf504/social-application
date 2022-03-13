const APIFeatures = require("../../util/APIfeatures");
const AppError = require("../../util/appError");
const catchAsync = require("../../util/catchAsync");
const Post = require("../models/postModel");

// For User

exports.getPost = catchAsync(async (req, res, next) => {
    const query = Post.find({createBy: req.user._id});
    const features = new APIFeatures(query, req.query).filter().sort().limitFields().paginate();
    const post = await features.query;
    if (! post) {
        return next(new AppError("No post found with that ID", 404));
    }
    res.status(200).json({status: "success", results: post.length, data: {
            post
        }});
});

exports.createPost = catchAsync(async (req, res, next) => {
    const newPost = await Post.create({title: req.body.title, content: req.body.content, createBy: req.user._id});
    res.status(201).json({status: "success", newPost});
});

exports.updatePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (req.user_id != post.post) {
        next(new AppError("You are not authorized to update this post", 401));
    }
    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();
    res.status(200).json({status: "success", data: {
            post
        }});
});

exports.deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (req.user_id != post.post) {
        next(new AppError("You are not authorized to delete this post", 401));
    }
    await post.remove();
    res.status(200).json({status: "success", data: null});
});

// For Admin && Super Admin

exports.getAllPostsByAdmin = catchAsync(async (req, res, next) => {
    const query = Post.find({}).populate({
        path: "createBy",
        select: ["name", "email"]
    });
    const features = new APIFeatures(query, req.query).filter().sort().limitFields().paginate();
    const posts = await features.query;
    res.status(200).json({status: "success", results: posts.length, data: {
            posts
        }});
});

exports.deletePostByAdmin = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (! post) {
        return next(new AppError("No post found with that ID", 404));
    }
    await post.remove();
    res.status(200).json({status: "success", data: null});
});
