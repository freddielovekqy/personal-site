/**
 * Created by freddie on 2017/1/8.
 */
app.service('HttpService', ['$rootScope', '$http', function ($rootScope, $http) {
    function post (httpParams) {
        $http({
            url: httpParams.url,
            method: 'POST',
            data: httpParams.params
        }).success(function (data) {
            console.log('common http service post', data);
            if (data.errorMessage) {
                $rootScope.$broadcast('showAlertMessage', {
                    type: 'danger',
                    message: data.errorMessage
                })
            }
            httpParams.success && httpParams.success(data);
        }).error(function (data) {
            httpParams.error && httpParams.error();
        });
    }

    return {
        post: post
    };
}]);