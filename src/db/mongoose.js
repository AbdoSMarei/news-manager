const mongoose = require("mongoose");

// connect with DB
mongoose.connect("mongodb://127.0.0.1:27017/news-manager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});