const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

const blogController = require('../controllers/blogController');

router.post('/post', uploadMiddleware.single('file'), blogController.createPost);
router.put('/post', uploadMiddleware.single('file'), blogController.updatePost);
router.get('/post', blogController.getPosts);
router.get('/post/:id', blogController.getPostById);
router.delete('/post/:id', blogController.deletePost);

module.exports = router;