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

app.service('StorageUtils', [function () {
    function setSessionStorage(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    function getSessionStorage(key) {
        return JSON.parse(sessionStorage.getItem(key));
    }

    function setLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
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
