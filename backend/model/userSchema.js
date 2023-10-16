const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        work: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        cpassword: {
            type: String,
            required: true
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ]
    }
)

//password hashing
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

//generating JWT 
userSchema.methods.generateAuthToken = async function() {
    try {
        //jwt.sign(payload - it must be unique, secretorPrivacyKey)
        let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        this.save();
        return token;
    } catch (error) {
        console.log(`${error}`);
    }
}

//create a collection and connect schema with our database
const User = mongoose.model('USER', userSchema);

module.exports = User;