const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the schema for the Post model
const PostSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

// Create the Post model using the schema
const PostModel = model('Post', PostSchema);

// Export the Post model
module.exports = PostModel;
