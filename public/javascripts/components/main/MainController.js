testApp.controller('MainController', function($scope, BlogService, User, HelperService, $timeout) {
    $scope.BlogService = BlogService;
    $scope.HelperService = HelperService;
    $scope.User = User;
    $scope.showArticleDialog = false;
    $scope.articleSearchTerm = '';
    $scope.sortNewOnTop = 'newOnTop';
    $scope.sortOldOnTop = 'oldOnTop';// by default from server
    $scope.activeSort = $scope.sortOldOnTop;
    $scope.sortReverse = false;

    BlogService.get(function(blogs) {
        BlogService.blogsArray = blogs?blogs:[];
    },function(err){
        console.log(err)
    });

    /*sort only title and text fields*/
    $scope.searchFilter = function(term){
        return term.title.indexOf($scope.articleSearchTerm)>=0 || term.text.indexOf($scope.articleSearchTerm)>=0;
    }

    $scope.articleCreate = function(){
        $scope.showArticleDialog = true;
    };
})
.directive('articleDialog', function(){
    return {
        restrict: 'E',
        scope: false,
        replace: true,
        templateUrl: 'build/components/main/article-dialog.html',
        controller: function( $scope, BlogService) {
            $scope.article = {};
            $scope.articleErrorsFlag = false;
            $scope.articleErrors = "";

            $scope.closeDialog = function(){
                $scope.article = {};
                $scope.showArticleDialog = false;
            };

            $scope.createArticle = function(form){
                $scope.article_in_progress = true;
                if (form.$valid) {
                    BlogService.articleCreate($scope.article,function(response){
                       /*update blog array and close article dialog*/
                        BlogService.get(function(blogs){
                            BlogService.blogsArray = blogs;
                            $scope.closeDialog();
                            $scope.articleErrorsFlag = false;
                            $scope.articleErrors = "";
                        },function(err){
                            $scope.articleErrorsFlag = true;
                            $scope.articleErrors = err;
                            console.log(err)
                        });
                    },function(response){
                        $scope.articleErrorsFlag = true;
                        $scope.articleErrors = response;
                    })
                }else{
                    $scope.articleErrorsFlag = true;
                    $scope.articleErrors = "Form not valid";
                }
            }
        }
    }
})
