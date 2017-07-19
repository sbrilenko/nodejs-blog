
testApp.controller('AuthController', function($scope, $routeParams, $location, User) {

    $scope.login = {};
    $scope.registration = {};
    $scope.loginInProgress = false;
    $scope.loginFlag = false;
    $scope.registrationFlag = false;

    $scope.signIn = function(form) {
        $scope.loginInProgress = true;
        if (form.$valid){
            if($scope.login.email && $scope.login.password){
                User.auth($scope.login.email, $scope.login.password, function(response, user_instance) {
                    user_instance.token = response.token;
                    user_instance.saveToken(user_instance.token);
                    user_instance.saveEmail($scope.login.email);
                    $location.path('/');
                }, function(response) {
                    $scope.loginInProgress = false;
                    $scope.loginFlag = true;
                    $scope.loginErrors = response;
                });
            }else{
                $scope.loginInProgress = false;
            }
        } else {
            $scope.loginInProgress = false;
        }
    };

    $scope.signUp = function(form) {
        $scope.loginInProgress = true;
        if (form.$valid) {
            if($scope.registration.email && $scope.registration.password) {
                if($scope.registration.password===$scope.registration.confirmPassword) {
                    User.registration({email: $scope.registration.email, password: $scope.registration.password }, function(response) {
                        User.auth($scope.registration.email, $scope.registration.password, function(response, user_instance) {
                            user_instance.token = response.token;
                            user_instance.saveToken(user_instance.token);
                            user_instance.saveEmail($scope.registration.email);
                            $location.path('/');
                        }, function(response) {
                            $scope.loginInProgress = false;
                            $scope.registrationFlag = true;
                            $scope.registrationErrors = response;
                        });
                    }, function(response) {
                        $scope.loginInProgress = false;
                        $scope.registrationFlag = true;
                        $scope.registrationErrors = response;
                    });
                }else{
                    $scope.loginInProgress = false;
                    $scope.registrationFlag = true;
                    /*match directive must work, but here check too*/
                    $scope.registrationErrors = "Password and confirm password don't match";
                }
            }else{
                $scope.loginInProgress = false;
            }
        } else {
            $scope.loginInProgress = false;
        }
    };

    $scope.logout = function() {
        User.logout();
    }
});
