var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var AttentionSchema = new Schema({
    typeName: { type: String },
    userId: { type: String } // 当userId为'1'时，表示用户的关注分类
});

var RelationshipSchema = new Schema({
    userId: { type: String },
    types: { type: [String] },
    attentions: [AttentionSchema]
});

module.exports.Relationship = mongoose.model('Relationship', RelationshipSchema);
module.exports.Attention = mongoose.model('Attention', AttentionSchema);