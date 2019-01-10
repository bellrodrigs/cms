const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    article: {
        type: String,
        require: true,
    }
});

module.exports = mongoose.model('Article', ArticleSchema);