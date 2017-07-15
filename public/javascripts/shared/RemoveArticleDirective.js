/**
 * Created by sbrilenko on 7/15/2017.
 */
testApp.directive('removePost',['$location','$timeout','User', 'BlogService','HelperService', function($location, $timeout, User, BlogService, HelperService) {
    return {
        scope: {
            postId: '@',
            path: '@'
        },
        restrict: 'AE',
        replace: 'true',
        templateUrl:  'build/shared/templates/remove-article.html',
        controller: function($scope, User, BlogService, HelperService, $timeout, $location) {
            $scope.User = User;
            $scope.removeArticle = function(){
                HelperService.postIdToRemove = $scope.postId;
                $timeout(function(){
                    if (confirm("Are you sure you want to remove the article?")) {
                        BlogService.remove($scope.postId, function(response){
                            HelperService.postIdToRemove = "";
                            if($scope.path === "main"){
                                /*find and remove article with id = postId*/
                                BlogService.blogsArray = BlogService.blogsArray.filter(function(article) {
                                    return article.id !== $scope.postId;
                                });
                            }else{
                                $location.path('/')
                            }
                        }, function(response){
                            console.log(response)
                            HelperService.postIdToRemove = "";
                        })
                    } else {
                        console.log("As you wish")
                        HelperService.postIdToRemove = "";
                    }
                })
            }
        },
        link: function (scope, elem, attrs) {

        }
    }
}]);
