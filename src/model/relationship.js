var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var AttentionSchema = new Schema({
    typeName: { type: String },
    userId: { type: String },
    source: { type: String } // 关注的渠道
});

var RelationshipSchema = new Schema({
    userId: { type: String },
    types: { type: [String] },
    attentions: [AttentionSchema]
});

module.exports.Relationship = mongoose.model('Relationship', RelationshipSchema);
module.exports.Attention = mongoose.model('Attention', AttentionSchema);