var app = angular.module('App', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        }).when('/dashboard', {
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardController'
        }).when('/signup', {
            templateUrl: 'templates/signup.html',
            controller: 'SignupController'
        }).when('/posts', {
            templateUrl: 'templates/posts.html',
            controller: 'PostController'
        });
});




//manages the session
//this is called before every page is run
app.run(function($rootScope, $window, $location) {
    $rootScope.$on('$routeChangeStart', function(event, a){
        console.log(a.$$route.originalPath);
        if(!$window.sessionStorage.user && a.$$route.originalPath!="/signup"){
            $location.path('/');
        }else if(a.$$route.originalPath=="/signup"){

        }
    });

    $rootScope.$on('$viewContentLoaded',function(){
        $('.dropdown-toggle').dropdown();
    });
});





app.controller('LoginController', ['$scope','$http', '$location', '$rootScope', '$window', function($scope, $http, $location, $rootScope, $window) {
    //$scope.user = { name: 'John Doe', age: 22 };

    

    $scope.init=function(){
        if($window.sessionStorage.user){
            $location.path('/dashboard');
        }
        $scope.user={};
    };

    $scope.login=function(user){

        //console.log(user);
        $http({
            method:"POST",
            url:"http://localhost/ng/verify_user.php",
            data:{
                'email':user.email,
                'password':user.password
            }
        }).then(function(response){
            if(response.data!="false"){
                $window.sessionStorage.setItem('user', JSON.stringify((response.data)));
                $location.path('/dashboard');
            }else{
                sweetAlert('Login Failed');
            }
        }, function(error){});
    };

}]);

app.controller('DashboardController', ['$scope', '$rootScope','$http','$location', '$window', function($scope, $rootScope,$http, $location, $window) {
    
    $scope.init=function(){
        $scope.user=JSON.parse($window.sessionStorage.getItem('user'));
    };

    $scope.logout=function(){
        delete $window.sessionStorage.user;
        $location.path('/');
    };

    $scope.add=function(post){
        $http({
            method:"POST",
            url:"http://localhost/ng/add_post.php",
            data:{
                'title':post.title,
                'body':post.body,
                'user':$scope.user.id
            }
        }).then(function(response){
            if(response.data!="false"){
                sweetAlert('Post created successfully.');
                $location.path('/posts');
            }else{
                sweetAlert('Post not created!');
            }
        }, function(error){});
    };

}]);

app.controller('PostController', ['$scope', '$rootScope','$http','$location', '$window', function($scope, $rootScope,$http, $location, $window) {
    
    $scope.init=function(){
        $scope.user=JSON.parse($window.sessionStorage.getItem('user'));

        $http({
            method:"GET",
            url:"http://localhost/ng/view_post.php?id="+$scope.user.id
        }).then(function(response){
            if(response.data!="false"){
                $scope.posts=angular.copy(response.data);
            }else{
                sweetAlert('Something wrong happened!');
            }
        }, function(error){});
    };

    $scope.logout=function(){
        delete $window.sessionStorage.user;
        $location.path('/');
    };

}]);

app.controller('SignupController', ['$scope', '$rootScope', '$http', '$location', '$window', function($scope, $rootScope, $http, $location, $window) {
    
    $scope.init=function(){
        if($window.sessionStorage.user){
            $location.path('/dashboard');
        }
        $scope.user={};
    };

    $scope.signup=function(user){

        //console.log(user);
        $http({
            method:"POST",
            url:"http://localhost/ng/add_user.php",
            data:{
                'name':user.name,
                'email':user.email,
                'password':user.password
            }
        }).then(function(response){
            if(response.data!="false"){
                $window.sessionStorage.setItem('user', JSON.stringify((response.data)));
                $location.path('/dashboard');
            }else{
                sweetAlert('User not created!');
            }
        }, function(error){});
    };
}]);
