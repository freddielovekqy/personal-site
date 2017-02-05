app.service('CommonUtils', [function () {
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

app.service('SessionStorageUtils', [function () {
    function setItem (key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    function getItem (key) {
        return JSON.parse(sessionStorage.getItem(key));
    }

    return {
        setItem: setItem,
        getItem: getItem
    }
}]);

app.service('DateUtils', [function () {
    function formatCommonDate(date, format) {
        if (!format) {
            format = 'yyyy-MM-dd HH:mm:ss';
        }
        var o = {
            "M+" : date.getMonth()+1, //month
            "d+" : date.getDate(), //day
            "h+" : date.getHours(), //hour
            "m+" : date.getMinutes(), //minute
            "s+" : date.getSeconds(), //second
            "q+" : Math.floor((date.getMonth()+3)/3), //quarter
            "S" : date.getMilliseconds() //millisecond
        };

        if(/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }

        for(var k in o) {
            if(new RegExp("("+ k +")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return format;
    }

    return {
        formatCommonDate: formatCommonDate
    }
}]);