
testApp.controller('BlogController', function($scope, $routeParams, $location, User, BlogService) {

    $scope.article = {};
    $scope.User = User;
    $scope.article_in_progress = false;
    $scope.articleErrorsFlag = false;
    $scope.articleErrors = "";
    $scope.postId = $routeParams.postId;

    BlogService.findArticle($scope.postId, function(article){
        $scope.article = article;
    },function(err){
        console.log(err)
    });

    $scope.editArticle = function(form){
        $scope.article_in_progress = true;
        if (form.$valid) {
            BlogService.articleEdit($scope.article,function(response){
                $scope.article_in_progress = false;
                $scope.articleErrorsFlag = false;
                $scope.articleErrors = "";
                $location.path('/');
            },function(response){
                $scope.article_in_progress = false;
                $scope.articleErrorsFlag = true;
                $scope.articleErrors = response.data.message;
            })
        }else{
            $scope.article_in_progress = false;
            $scope.articleErrorsFlag = true;
            $scope.articleErrors = "Form not valid";
        }
    }

});
