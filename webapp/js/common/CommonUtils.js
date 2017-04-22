app.service('CommonUtils', ['HttpService', function (HttpService) {
    var isPCClient;
    function isPC () {
        if (!isPCClient) {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                isPCClient = 'false';
            } else {
                isPCClient = 'true';
            }
        }
        return isPCClient === 'true';
    }

    return {
        isPC: isPC
    }
}]);

app.service('CommonUserUtils', ['$location', 'HttpService', function ($location, HttpService) {
    var currentUserInfo;
    var currentUserBlogInfo;
    var userBlogInfo = {};
    var getCurrentUserInfoPromise;

    function getCurrentUserInfo() {
        if (!currentUserInfo) {
            if (!getCurrentUserInfoPromise) {
                getCurrentUserInfoPromise = new Promise(function (resolve, reject) {
                    HttpService.get({
                        url: 'api/user/currentUser',
                        success: function (data) {
                            if (!data) {
                                // 跳转到登录页面
                                $location.url('/login');
                            } else {
                                currentUserInfo = data;
                                resolve(data);
                            }
                            getCurrentUserInfoPromise = undefined;
                        },
                        error: function (data) {
                            getCurrentUserInfoPromise = undefined;
                        }
                    });
                });
            }
            return getCurrentUserInfoPromise;
            
        } else {
            return currentUserInfo;
        }
    }

    function getCurrentUserBlogInfo() {
        if (currentUserBlogInfo) {
            return currentUserBlogInfo;
        } else {
            var result = getCurrentUserInfo();
            if (result instanceof Promise) {
                return result.then(userInfo => {
                    return getUserBlogInfoFunc(userInfo._id, data => {
                        currentUserBlogInfo = data;
                    });
                });
            } else {
                return getUserBlogInfoFunc(result._id, data => {
                    currentUserBlogInfo = data;
                });
            }
        }
    }

    function updateCurrentUserInfo(callback) {
        HttpService.get({
            url: 'api/user/currentUser',
            success: function (data) {
                currentUserInfo = data;
                postal.publish({
                    channel: 'user',
                    topic: 'updateUserInfo',
                    data: {}
                });
                callback && callback(userInfo);
            },
            error: function (data) {
            }
        });
    } 

    function getUserBlogInfoFunc(userId, callback) {
        return new Promise(function (resolve, reject) {
            HttpService.get({
                url: 'api/userBlogInfo/getInfo/' + userId,
                success: function (data) {
                    callback && callback(data);
                    resolve(data);
                },
                error: function (data) {
                    console.log('get info error');
                }
            });
        });
    }

    return {
        getCurrentUserInfo: getCurrentUserInfo,
        updateCurrentUserInfo: updateCurrentUserInfo,
        getCurrentUserBlogInfo: getCurrentUserBlogInfo
    };
}]);

app.service('StorageUtils', [function () {
    function setSessionStorage(key, value) {
        if (typeof value === 'string') {
            sessionStorage.setItem(key, value);
        } else {
            sessionStorage.setItem(key, JSON.stringify(value));
        }
    }

    function getSessionStorage(key) {
        return JSON.parse(sessionStorage.getItem(key));
    }

    function setLocalStorage(key, value) {
        if (typeof value === 'string') {
            localStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    function  getLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    return {
        setSessionStorage: setSessionStorage,
        getSessionStorage: getSessionStorage,
        setLocalStorage: setLocalStorage,
        getLocalStorage: getLocalStorage
    }
}]);

app.service('RadioBroadcast', ['$rootScope', function ($rootScope) {
    function broadcast(broadcastType, data) {
        $rootScope.$broadcast(broadcastType, data);
        $rootScope.$emit(broadcastType, data);
    }

    return {
        broadcast: broadcast
    };
}]);
