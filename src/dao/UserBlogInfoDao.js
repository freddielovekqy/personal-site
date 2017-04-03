var UserBlogInfo = require("../model/userBlogInfo");

function findByUser(userId) {
    return UserBlogInfo.findOne({userId: userId}).exec();
}

function save(userBlogInfoDTO) {
    var userBlogInfo = new UserBlogInfo({
        userId: userBlogInfoDTO.userId,
        level: userBlogInfoDTO.level,
        totalHits: userBlogInfoDTO.totalHits,
        integral: userBlogInfoDTO.integral,
        ranking: userBlogInfoDTO.ranking
    });
    return userBlogInfo.save();
}

module.exports.findByUser = findByUser;
module.exports.save = save;