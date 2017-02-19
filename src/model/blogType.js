var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;


var BlogTypeSchema = new Schema({
    name: {type: String},
    userId: {type: String}
});

module.exports = mongoose.model('BlogType', BlogTypeSchema);