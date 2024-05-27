const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the schema for the User model
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 4,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create the User model using the schema
const UserModel = model('User', UserSchema);

// Export the User model
module.exports = UserModel;
