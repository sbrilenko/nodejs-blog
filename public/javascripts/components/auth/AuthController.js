
testApp.controller('AuthController', function($scope, $routeParams, $location, User) {

    $scope.login = {};
    $scope.registration = {};
    $scope.login_in_progress = false;
    $scope.loginFlag = false;
    $scope.registrationFlag = false;

    $scope.signIn = function(form) {
        $scope.login_in_progress = true;
        if (form.$valid){
            if($scope.login.email && $scope.login.password){
                User.auth($scope.login.email, $scope.login.password, function(response, user_instance) {
                    user_instance.token = response.token;
                    user_instance.saveToken(user_instance.token);
                    user_instance.saveEmail($scope.login.email);
                    $location.path('/');
                }, function(response) {
                    $scope.login_in_progress = false;
                    $scope.loginFlag = true;
                    $scope.loginErrors = response.data.message;
                });
            }else{
                $scope.login_in_progress = false;
            }
        } else {
            $scope.login_in_progress = false;
        }
    };

    $scope.signUp = function(form) {
        $scope.login_in_progress = true;
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
                            $scope.login_in_progress = false;
                            $scope.registrationFlag = true;
                            $scope.registrationErrors = response.data.message;
                        });
                    }, function(response) {
                        $scope.login_in_progress = false;
                        $scope.registrationFlag = true;
                        $scope.registrationErrors = response.data.message;
                    });
                }else{
                    $scope.login_in_progress = false;
                    $scope.registrationFlag = true;
                    /*match directive must work, but here check too*/
                    $scope.registrationErrors = "Password and confirm password don't match";
                }
            }else{
                $scope.login_in_progress = false;
            }
        } else {
            $scope.login_in_progress = false;
        }
    };

    $scope.logout = function() {
        User.logout();
    }
});
