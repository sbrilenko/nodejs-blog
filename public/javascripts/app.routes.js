testApp.config(['$routeProvider', function ($routeProvider, $location) {

    function redirectTo404() {
            window.location.href = '/404.html';
    }
    $routeProvider
        .when('/', {
            controller: 'MainController',
            templateUrl: BASE_TEMPLATE_FOLDER + '/components/main/index.html'
        })
        .when('/auth',{
            controller: 'AuthController',
            templateUrl: BASE_TEMPLATE_FOLDER + '/components/auth/index.html',
            resolve: {
                access: function (User, $location) {
                    if (User.isAuthorizated()) {
                        $location.path('/');
                        return;
                    }
                    return User.isAuthorizated();
                }
            }
        })
        .when('/blog/:postId', {
            controller: 'BlogController',
            templateUrl: BASE_TEMPLATE_FOLDER + '/components/blog/index.html'
        })
        /**
         * in every other case redirect to index route
         */
        .otherwise({
            redirectTo: redirectTo404
        });
}]);
