const express = require("express"); // required express
const User = require("../models/reporter"); // required Reporter Model
const auth = require('../middleware/auth') // required auth Model

const router = new express.Router(); // init expressRouter

// Create User 
router.post('/users', async(req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send('Error: ' + e)
    }
})

// Get All
router.get('/users', auth, async(req, res) => {
    try {
        const user = await User.find({})
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send('Error: ' + e)
    }
})

// Get By ID
router.get('/users/:id', auth, async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send('User Not Found')
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send('Something Wrong???')
    }
})


// Update By ID
router.patch('/users/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body) // All Updates Array
    const allowed = ['name', 'password', 'address'] // Allowed Updates Array
    let isMatch = updates.every((el) => allowed.includes(el)) // Check For Match allowed
    if (!isMatch) {
        return res.status(404).send('Error: ' + isMatch)
    }
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send('User Not Found')
        }
        updates.forEach((el) => user[el] = req.body[el])
        await user.save()
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send("Error: " + e)
    }
})

// Delete By ID
router.delete('/users/:id', auth, async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send('User Not Found')
        }
        res.status(200).send('Sucessfully Deleted!!!')
    } catch (e) {
        res.status(500).send('Error: ' + e)
    }
})

// Login
router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send({
            error: { message: 'You have entered an invalid email or password' },
        });
    }
});

// Go To Profile
router.post("/welcome", auth, async(req, res) => {
    res.send(req.user);
});

// logout
router.post('/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((el) => {
            return el.token !== req.token
        })
        await req.user.save()
        res.send('Logout successfully')
    } catch (e) {
        res.status(500).send('Error please try again')
    }

})

// logout all 
router.post('/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Logout all was done successsfully')
    } catch (e) {
        res.send('Please login')
    }
})



module.exports = router;