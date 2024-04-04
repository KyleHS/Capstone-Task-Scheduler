const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define User Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(this.password, salt);
        // Replace the plain password with the hashed one
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords during authentication
userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

// Create User Model
const User = mongoose.model('User', userSchema);

// Export User Model
module.exports = User;