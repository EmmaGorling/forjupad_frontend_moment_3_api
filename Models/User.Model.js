const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { required } = require('joi');

const UserSchema = new Mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true,
        min: 8
    }
});

// Compare password
UserSchema.methods.comparePassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
}
// Create model
const User = new Mongoose.model('User', UserSchema);

// Export model
module.exports = User;