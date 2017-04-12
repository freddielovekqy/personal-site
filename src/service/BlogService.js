var BlogDao = require('../dao/BlogDao');
var logger = require('../common/log/log4js').logger;


function getBlogsByUser(blogUserId, visitUserId, searchOptions, paginationParams) {
    return new Promise(function (resolve, reject) {
        var candition = { userId: blogUserId };
        console.log('searchOptions', searchOptions);
        if (searchOptions.title) {
            candition.title = {
                $regex: new RegExp(searchOptions.title)
            };
        }

        if (searchOptions.type) {
            candition.type = searchOptions.type;
        }

        if (searchOptions.categories && searchOptions.categories.length > 0) {
            candition.categories = {
                $in: searchOptions.categories
            };
        }

        if (blogUserId !== visitUserId) {
            candition.status = '1';
        } else {
            candition['$or'] = [
                { status: '1' },
                { status: '2' }
            ];
        }
        var dataPromise = BlogDao.findByUser(candition, paginationParams);
        var countPromise = BlogDao.getBlogCountByCondition(candition);
        Promise.all([dataPromise, countPromise]).then(function (data) {
            var result = {
                blogs: data[0],
                totalCount: data[1]
            }
            resolve(result);
        });
    });
}

function getBlogById(blogId) {
    return new Promise(function (resolve, reject) {
        var promise = BlogDao.findById(blogId);
        promise.then(function (data) {
            resolve(data);
        }).catch(data => {
            throw data;
        });
    });
}

function saveBlog(blogDTO) {
    return new Promise(function (resolve, reject) {
        logger.info('saveBlog', blogDTO);
        var promise = BlogDao.save(blogDTO);
        promise.then(function (data) {
            resolve(data);
        });
    });
}

function updateBlog(blog) {
    return new Promise(function (resolve, reject) {
        var promise = BlogDao.findById(blog._id);
        promise.then(function (data) {
            var oldBlog = data[0];
            blog.createDate = oldBlog.createDate;
            blog.lastUpdateDate = new Date();
            blog.userId = oldBlog.userId;
            var blogId = blog._id;
            delete blog._id;
            return BlogDao.update(blogId, blog);
        }).then(function (data) {
            resolve(data);
        });
    });
}

function deleteBlog(id) {
    return new Promise(function (resolve, reject) {
        var promise = BlogDao.updateBlogAttr(id, 'status', 4);
        promise.then(function (data) {
            resolve(data);
        });
    });
}

function updateBlogAttr(id, attrName, attrValue) {
    return new Promise(function (resolve, reject) {
        var promise = BlogDao.updateBlogAttr(id, attrName, attrValue);
        promise.then(function (data) {
            resolve(data);
        });
    });
}

module.exports.getBlogsByUser = getBlogsByUser;
module.exports.getBlogById = getBlogById;
module.exports.saveBlog = saveBlog;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.updateBlogAttr = updateBlogAttr;