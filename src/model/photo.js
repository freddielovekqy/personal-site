var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    path: {type: String}
});

var AlbumSchema = new Schema({
    name: {type: String},
    status: {type: Number} // 1: 常态；0: 
});