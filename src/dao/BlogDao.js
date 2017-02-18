var Blog = require("../model/blog.js");

function save(blogDTO) {
    var blog = new Blog({
        title: blogDTO.title,
        summary: blogDTO.summary,
        keyword: blogDTO.keyword,
        content: blogDTO.content,
        type: blogDTO.type,
        status: blogDTO.status,
        userId: blogDTO.userId,
        comment: blogDTO.comment,
        reader: blogDTO.reader
    });
    var promise = blog.save();
    promise.then(function (data) {
        return data;
    }).catch(function (error) {
        return error;
    });
}

function findByUser(userId, paginationParams, isCurrentUser) {
    var candition = { userId: userId };
    !isCurrentUser && (candition.isPublic = true);
    // sort = {'logindate':-1}
    var promise = Blog.find(candition).skip(paginationParams.startIndex).limit(paginationParams.pageSize).sort(paginationParams.sort).exec();
    promise.then(function (data) {
        return data;
    }).catch(function (error) {
        return error;
    });
    return promise;
}

function findByBlogId(blogId) {
    var promise = Blog.find({ _id: blogId }).exec();
    promise.then(function (data) {
        return data;
    }).catch(function (error) {
        return error;
    });
    return promise;
}

function getBlogCountByCondition(condition) {
    var promise = Blog.count(condition).exec();
    promise.then(function (data) {
        return data;
    });
    return promise;
}

module.exports.save = save;
module.exports.findByUser = findByUser;
module.exports.findByBlogId = findByBlogId;
module.exports.getBlogCountByCondition = getBlogCountByCondition;