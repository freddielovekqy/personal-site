/**
 * Created by freddie on 2016/10/25.
 */
var blogListModule = angular.module('blogList', []);
blogListModule.controller('BlogListController', ['$scope', function ($scope) {
    var _this = this;

    $scope.blogList = [
        {
            title: '解决Git提交代码时需要输入用户名密码',
            summary: '每次提交代码时需要输入用户名密码，则说明你在从仓库中clone代码时使用的是HTTPs的key进行拉取代码。 而是用SSH key拉取代码时，则不需要。下面是进行SSH key配置 1、在git bash命令行中输入 $ ls -al ~/.ssh检查电脑中是否已经存在SSH key 2、创建一个新的SSH key $ ssh-keygen -t rsa -C "'
        }, {
            title: 'Git 取消跟踪已版本控制的文件',
            summary: 'Git 是一个很好的版本控制工具，当然驾驭起来相比 SVN 要稍微复杂一些。初入 Git，难免有一些问题。比如我们不小心将某个文件加入了版本控制，但是突然又不想继续跟踪控制这个文件了，怎么办呢？ 其实方法也是很简单的。使用git update-index 即可。 不想继续追踪某个文件 git update-index --assume-unchanged your_file_path'
        }, {
            title: 'SpringMVC中的MyBatis',
            summary: 'application配置 classpath:jdbc.properties'
        }, {
            title: '解决Git提交代码时需要输入用户名密码',
            summary: '每次提交代码时需要输入用户名密码，则说明你在从仓库中clone代码时使用的是HTTPs的key进行拉取代码。 而是用SSH key拉取代码时，则不需要。下面是进行SSH key配置 1、在git bash命令行中输入 $ ls -al ~/.ssh检查电脑中是否已经存在SSH key 2、创建一个新的SSH key $ ssh-keygen -t rsa -C "'
        }, {
            title: 'Git 取消跟踪已版本控制的文件',
            summary: 'Git 是一个很好的版本控制工具，当然驾驭起来相比 SVN 要稍微复杂一些。初入 Git，难免有一些问题。比如我们不小心将某个文件加入了版本控制，但是突然又不想继续跟踪控制这个文件了，怎么办呢？ 其实方法也是很简单的。使用git update-index 即可。 不想继续追踪某个文件 git update-index --assume-unchanged your_file_path'
        }, {
            title: 'SpringMVC中的MyBatis',
            summary: 'application配置 classpath:jdbc.properties'
        }, {
            title: '解决Git提交代码时需要输入用户名密码',
            summary: '每次提交代码时需要输入用户名密码，则说明你在从仓库中clone代码时使用的是HTTPs的key进行拉取代码。 而是用SSH key拉取代码时，则不需要。下面是进行SSH key配置 1、在git bash命令行中输入 $ ls -al ~/.ssh检查电脑中是否已经存在SSH key 2、创建一个新的SSH key $ ssh-keygen -t rsa -C "'
        }, {
            title: 'Git 取消跟踪已版本控制的文件',
            summary: 'Git 是一个很好的版本控制工具，当然驾驭起来相比 SVN 要稍微复杂一些。初入 Git，难免有一些问题。比如我们不小心将某个文件加入了版本控制，但是突然又不想继续跟踪控制这个文件了，怎么办呢？ 其实方法也是很简单的。使用git update-index 即可。 不想继续追踪某个文件 git update-index --assume-unchanged your_file_path'
        }, {
            title: 'SpringMVC中的MyBatis',
            summary: 'application配置 classpath:jdbc.properties'
        }
    ];
}]);