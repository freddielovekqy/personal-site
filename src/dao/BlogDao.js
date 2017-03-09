var Blog = require("../model/blog.js");

function save(blogDTO) {
    var blog = new Blog({
        title: blogDTO.title,
        summary: blogDTO.summary,
        keyword: blogDTO.keyword,
        content: blogDTO.content,
        type: blogDTO.type,
        categories: blogDTO.categories,
        status: blogDTO.status,
        commentAble: blogDTO.commentAble,
        topShow: blogDTO.topShow,
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

function update(id, blog) {
    return Blog.update({'_id': id}, blog);
}

function updateBlogAttr(id, key, value) {
    var updateObj = {};
    updateObj[key] = value;
    return Blog.update({ '_id': id }, { '$set': updateObj });
}

function findByUser(candition, paginationParams) {
    // sort = {'logindate':-1}
    console.log('candition', candition);
    return Blog.find(candition).skip(paginationParams.startIndex).limit(paginationParams.pageSize).sort(paginationParams.sort).exec();
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
module.exports.update = update;
module.exports.updateBlogAttr = updateBlogAttr;
module.exports.findByUser = findByUser;
module.exports.findByBlogId = findByBlogId;
module.exports.getBlogCountByCondition = getBlogCountByCondition;