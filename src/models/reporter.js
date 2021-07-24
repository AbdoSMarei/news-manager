const mongoose = require('mongoose'); // require mongoose
const validator = require('validator'); // require validator
const bcrypt = require("bcryptjs"); // require bcryptjs
const jwt = require('jsonwebtoken') // require jsonwebtoken

// init ReporterSchema
const reporterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 25,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(email) {
            if (!validator.isEmail(email))
                throw new Error('Email Is Invalid Please Try Again!!!')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        // validate(value) {
        //     if (value.toLowerCase().includes("password")) {
        //         throw new Error("Password can't contain password word");
        //     }
        // }
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Middleware ---> pre('save')
reporterSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})


// findByCredentials
reporterSchema.statics.findByCredentials = async(email, password) => {
    const user = await Reporter.findOne({ email })
    if (!user) {
        throw new Error('no email')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('not Password')
    }
    return user;
}

// generateAuthToken
//  Step 1 --> 
reporterSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'news-manager', { expiresIn: '7 days' })

    // Step 2 --> Save token D.B

    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token
}

// Ex!
// reporterSchema.statics.findByCredentials = async(request.payload.username, request.payload.password, (err, user, msg) => {
//     if (err) {
//         // Boom bad implementation
//         request.yar.flash('error', 'An internal server error occurred');
//         return reply.redirect('/login');
//     }
//     if (user) {
//         request.cookieAuth.set(user);
//         return reply.redirect('/account');
//     } else {
//         // User not fond in database
//         request.yar.flash('error', 'Invalid username or password');
//         return reply.redirect('/login');
//     }
// });

// init ReporterModel 
const Reporter = mongoose.model('Reporter', reporterSchema);

module.exports = Reporter; // export module
module.exports = Reporter; // export module