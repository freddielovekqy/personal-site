var UserBlogInfo = require("../model/userBlogInfo");

function findByUser(userId) {
    var promise = UserBlogInfo.find({userId: userId}).exec();
    promise.then(function (data) {
        return data;
    }).catch(function (error) {
        return error;
    });
    return promise;
}

module.exports.findByUser = findByUser;