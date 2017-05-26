function generateBlogPaginationFromReq(request) {
    if (!request) {
        return null;
    } else {
        var pageSize = parseInt(request.query.pageSize);
        var sortName = request.query.sortName;
        var sortType = request.query.sortType === 'asc' ? 1 : -1;
        var startIndex = (request.query.currentPage - 1) * pageSize;

        var pagination = {
            startIndex: startIndex,
            pageSize: pageSize,
            sort: {
                topShow: -1
            }
        };
        pagination.sort[sortName] = sortType;
        return pagination;
    }
}

module.exports.generateBlogPaginationFromReq = generateBlogPaginationFromReq