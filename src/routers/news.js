const express = require('express')
const News = require('../models/news')
const auth = require('../middleware/auth')
const router = new express.Router()

// Create News
router.post('/news', auth, async(req, res) => {
    const news = new News({...req.body, owner: req.user._id })
    try {
        await news.save()
        res.status(201).send(news)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Get All
router.get('/news', auth, async(req, res) => {
    try {
        await req.user.populate('userNews').execPopulate()
        res.send(req.user.userNews)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Get By ID
router.get('/news/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const news = await News.findOne({ _id, owner: req.user._id })
        if (!news) {
            return res.status(400).send('No News is found')
        }
        res.status(200).send(news)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Update By ID
router.patch('/news/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description']
    var isValid = updates.every((el) => allowedUpdates.includes(el))

    if (!isValid) {
        return res.status(400).send("Cannot update")
    }
    const _id = req.params.id
    try {
        const news = await News.findOne({ _id, owner: req.user._id })
        updates.forEach((el) => task[el] = req.body[el])
        await news.save()
        res.send(news)
    } catch (e) {
        res.status(400).send('No News is found ')
    }
})

// Delete By ID
router.delete('/news/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const news = await News.findOneAndDelete({ _id, owner: req.user._id })
        if (!news) {
            return res.status(400).send('No News is found')
        }
        res.status(200).send(news)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router