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

function save(userBlogInfoDTO) {
    var userBlogInfo = new UserBlogInfo({
        userId: userBlogInfoDTO.userId,
        level: userBlogInfoDTO.level,
        totalHits: userBlogInfoDTO.totalHits,
        integral: userBlogInfoDTO.integral,
        ranking: userBlogInfoDTO.ranking
    });
    var promise  = userBlogInfo.save();
    promise.then(function (data) {
        return data;
    }).catch(function (error) {
        return error;
    });
    return promise;
}

module.exports.findByUser = findByUser;
module.exports.save = save;