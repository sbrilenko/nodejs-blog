
testApp.controller('BlogController', function($scope, $routeParams, $location, User, BlogService) {

    $scope.article = {};
    $scope.User = User;
    $scope.articleInProgress = false;
    $scope.articleErrorsFlag = false;
    $scope.articleErrors = "";
    $scope.postId = $routeParams.postId;

    BlogService.findArticle($scope.postId, function(article){
        $scope.article = article;
    },function(err){
        console.log(err)
    });

    $scope.editArticle = function(form){
        $scope.articleInProgress = true;
        if (form.$valid) {
            BlogService.articleEdit($scope.article,function(response){
                $scope.articleInProgress = false;
                $scope.articleErrorsFlag = false;
                $scope.articleErrors = "";
                $location.path('/');
            },function(response){
                $scope.articleInProgress = false;
                $scope.articleErrorsFlag = true;
                $scope.articleErrors = response;
            })
        }else{
            $scope.articleInProgress = false;
            $scope.articleErrorsFlag = true;
            $scope.articleErrors = "Form not valid";
        }
    }

});
