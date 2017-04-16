var RelationshipSchema = require("../model/relationship");
var Relationship = RelationshipSchema.Relationship;
var Attention = RelationshipSchema.Attention;

function addRelationship(userId, types) {
    var relationshipEntity = new Relationship({
        userId: userId, 
        types: types
    });
    return relationshipEntity.save();
}

function addAttentionUser(currentUserId, targetUserId, attentionType) {
    var attentionEntity = new Attention({
        typeName: attentionType,
        userId: targetUserId
    });
    console.log(attentionEntity);
    return Relationship.update({userId: currentUserId}, {$addToSet: {attentions: attentionEntity}});
}

function deleteAttentionUser(currentUserId, targetUserId) {
    return Relationship.update({userId: currentUserId}, {$pull: {attentions: {userId: targetUserId}}});
}

function findUserAttentions(userId, paginationParams) {
    if (paginationParams) {
        // TODO 关于子数组文档的分页操作后续做
        // return Relationship.find({userId: userId}).skip(paginationParams.startIndex).limit(paginationParams.pageSize).sort(paginationParams.sort).exec();
    } else {
        return Relationship.findOne({userId: userId}).exec();
    }
}

function findAllUserAttentionTypes(userId) {
    return Relationship.findOne({userId: userId}, {userId: 1, types: 1}).exec();
}

module.exports.addRelationship = addRelationship;
module.exports.addAttentionUser = addAttentionUser;
module.exports.deleteAttentionUser = deleteAttentionUser;
module.exports.findUserAttentions = findUserAttentions;
module.exports.findAllUserAttentionTypes = findAllUserAttentionTypes;