var BlogDao = require('../dao/BlogDao');
var userDao = require('../dao/UserDao');
var relationshipDao = require('../dao/RelationshipDao');
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

/**
 * 用于首页获取所有用户的博客
 */
function findRecentBlogs() {
    return new Promise((resolve, reject) => {
        var results = [];
        BlogDao.findRecentBlogs()
            .then(blogs => {
                var findUserPromises = [];
                results = blogs;
                blogs.forEach(blog => {
                    findUserPromises.push(userDao.getBasicUserInfo(blog.userId));
                });
                return Promise.all(findUserPromises);
            })
            .then(users => {
                results = results.map((blog, index) => {
                    blog.userInfo = users[index];
                    return blog;
                });
                resolve(results);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function findAttentionBlogsByUser(userId) {
    return new Promise((resolve, reject) => {
        var userMap = {};
        var allBlogs = [];
        relationshipDao.findUserAttentions(userId)
            .then(userAttentions => {
                var getUsersInfoPromise = [];
                var attentionUserIds = [userId];
                userAttentions && userAttentions.attentions && userAttentions.attentions.forEach(attention => {
                    attentionUserIds.push(attention.userId);
                });
                attentionUserIds.forEach(userId => {
                    getUsersInfoPromise.push(userDao.getBasicUserInfo(userId));
                });
                return Promise.all(getUsersInfoPromise);
            })
            .then(users => {
                var findBlogsPromises = [];
                users.forEach(user => {
                    user = user.toObject();
                    var condition = {
                        userId: user._id.toString(),
                        status: 1
                    };
                    if (userId === user._id.toString()) {
                        condition = {
                            userId: userId,
                            $or: [
                                { status: '1' },
                                { status: '2' }
                            ]
                        };
                    }
                    findBlogsPromises.push(BlogDao.findByUser(condition));
                });
                userMap = _.keyBy(users, '_id');
                return Promise.all(findBlogsPromises);
            })
            .then(results => {
                results.forEach(blogs => {
                    blogs.forEach(blog => {
                        blog.userInfo = userMap[blog.userId];
                        allBlogs.push(blog);
                    });
                });
                resolve(allBlogs);
            })
            .catch(error => {
                reject(error);
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
module.exports.findAttentionBlogsByUser = findAttentionBlogsByUser;
module.exports.findRecentBlogs = findRecentBlogs;
module.exports.saveBlog = saveBlog;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.updateBlogAttr = updateBlogAttr;