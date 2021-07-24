const express = require('express')

const app = express()

const port = 6000 || process.env.PORT

require('./db/mongoose')

//Parse incmoming json
app.use(express.json())

const userRouter = require('./routers/reporter')
app.use(userRouter)

const newsRouter = require('./routers/news')
app.use(newsRouter)

app.listen(port, () => {
    console.log('Server is running')
})