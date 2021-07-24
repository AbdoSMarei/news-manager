const jwt = require('jsonwebtoken') // required jsonwebtoken
const User = require('../models/reporter') // required Reporter Model


const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'news-manager')
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token })
        if (!user) {
            throw new Error('Invalid user')
        }
        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate' })
    }
}

module.exports = auth