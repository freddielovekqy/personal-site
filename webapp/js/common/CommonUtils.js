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

    function getCurrentUserId() {
        var currentUserId = '';
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) {
            currentUserId = localStorage.getItem('currentUserId');
            HttpService.get({
                url: 'api/user/getUserInfo/' + currentUserId,
                success: function (data) {
                    sessionStorage.setItem(currentUser, JSON.stringify(data));
                },
                error: function (data) {
                }
            });
        }
        return currentUser._id;
    }

    return {
        isPC: isPC,
        getCurrentUserId: getCurrentUserId
    }
}]);

app.service('CommonUserUtils', ['HttpService', function (HttpService) {
    var userInfo;
    var userBlogInfo = {};

    function getUserInfo() {
        if (!userInfo) {
            return new Promise(function (resolve, reject) {
                var currentUserId = localStorage.getItem('currentUserId');
                HttpService.get({
                    url: 'api/user/getUserInfo/' + currentUserId,
                    success: function (data) {
                        userInfo = data;
                        resolve(data);
                    },
                    error: function (data) {
                    }
                });
            });
            
        } else {
            return userInfo;
        }
    }

    function getUserBlogInfo(userId) {
        if (!userBlogInfo[userId]) {
            return new Promise(function (resolve, reject) {
                var currentUserId = localStorage.getItem('currentUserId');
                HttpService.get({
                    url: 'api/userBlogInfo/getInfo/' + userId,
                    success: function (data) {
                        userBlogInfo[userId] = data;
                        resolve(data);
                    },
                    error: function (data) {
                        console.log('get blog list error');
                    }
                });
            });
            
        } else {
            return userBlogInfo[userId];
        }
    }

    return {
        getUserInfo: getUserInfo,
        getUserBlogInfo: getUserBlogInfo
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
