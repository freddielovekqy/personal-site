var BlogSchemaModule = require("../model/blog.js");
var Blog = BlogSchemaModule.Blog;
var BlogReader = BlogSchemaModule.BlogReader;
var Gooder = BlogSchemaModule.Gooder;

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
    return blog.save();
}

function update(id, blog) {
    return Blog.update({'_id': id}, blog);
}

function updateBlogAttr(id, key, value) {
    var updateObj = {};
    updateObj[key] = value;
    return Blog.update({ '_id': id }, { '$set': updateObj });
}

function countUserBlogs(userId) {
    return Blog.count({userId: userId, status: 1}).exec();
}

function findByUser(candition, paginationParams) {
    // sort = {'logindate':-1}
    console.log('candition', candition);
    if (paginationParams) {
        return Blog.find(candition).skip(paginationParams.startIndex).limit(paginationParams.pageSize).sort(paginationParams.sort).exec();
    } else {
        return Blog.find(candition).lean().exec();
    }
}

function findRecentBlogs(startIndex = 0, pageSize = 30) {
    return Blog
        .find({})
        .skip(startIndex)
        .limit(pageSize)
        .sort({ createDate: -1 })
        .lean()
        .exec();
}

function findById(blogId) {
    var promise = Blog.findById(blogId).exec();
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
module.exports.findRecentBlogs = findRecentBlogs;
module.exports.findById = findById;
module.exports.countUserBlogs = countUserBlogs;
module.exports.getBlogCountByCondition = getBlogCountByCondition;