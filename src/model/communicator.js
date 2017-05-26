var mongoose = require('../dao/db.js');
var Schema = mongoose.Schema;

var CommunicatorSchema = new Schema({
    userId: { type: String },
    communicatorId: { type: String }
});

module.exports.Communicator = mongoose.model('Communicator', CommunicatorSchema);