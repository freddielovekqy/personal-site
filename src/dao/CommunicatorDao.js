var CommunicatorSchemaModule = require("../model/communicator.js");
var Communicator = CommunicatorSchemaModule.Communicator;

function save(userId, communicatorId) {
    var communicatorEntity = new Communicator({
        userId: userId,
        communicatorId: communicatorId
    });
    return communicatorEntity.save();
}

function deleteCommunicator(userId, communicatorId) {
    return Communicator.delete({userId: userId, communicatorId: communicatorId});
}

function findCommunicatorsByUser(userId) {
    return Communicator.find({userId: userId}).lean().exec();
}

module.exports.save = save;
module.exports.deleteCommunicator = deleteCommunicator;
module.exports.findCommunicatorsByUser = findCommunicatorsByUser;