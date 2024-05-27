const fs = require('fs');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
require('dotenv').config();

const secret = process.env.SECRET;

// Create a new post
exports.createPost = async (req, res) => {
    console.log('Received POST request at /post');
    try {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);

        const { token } = req.cookies;
        console.log(`Token: ${token}`)
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) throw err;
            const { title, summary, content } = req.body;
            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id,
            });
            res.json(postDoc);
        });
    } catch (e) {
        console.error('Error in POST /post:', e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update an existing post
exports.updatePost = async (req, res) => {
    let newPath = null; if (req.file) {
        const { originalname, path } = req.file; const parts = originalname.split('.'); const ext = parts[parts.length - 1]; newPath = path +

            '.' + ext; fs.renameSync(path, newPath);
    } const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const { id, title, summary, content } = req.body;
            const postDoc = await Post.findById(id);
            if (!postDoc) {
                return res.status(404).json({ message: 'Post not found' });
            }
            const isAuthor = String(postDoc.author) === String(info.id);
            if (!isAuthor) {
                return res.status(403).json({ message: 'You are not the author' });
            }
            postDoc.title = title;
            postDoc.summary = summary;
            postDoc.content = content;
            postDoc.cover = newPath || postDoc.cover;

            await postDoc.save();

            res.json(postDoc);
        } catch (error) {
            console.error('Error in PUT /post:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
}


// Get the latest posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(posts);
    } catch (e) {
        res.status(500).json('An error occurred while fetching posts');
    }
};

// Get a post by ID
exports.getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const postDoc = await Post.findById(id).populate('author', ['username']);
        res.json(postDoc);
    } catch (e) {
        res.status(500).json('An error occurred while fetching the post');
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};