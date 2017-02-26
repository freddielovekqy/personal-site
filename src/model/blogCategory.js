var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;


var BlogCategorySchema = new Schema({
    name: { type: String },
    userId: { type: String }
});

module.exports = mongoose.model('BlogCategory', BlogCategorySchema);