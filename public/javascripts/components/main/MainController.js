testApp.controller('MainController', function($scope, BlogService, User, HelperService, $timeout) {
    $scope.BlogService = BlogService;
    $scope.HelperService = HelperService;
    $scope.User = User;
    $scope.showArticleDialog = false;
    $scope.search_in_progress = false;
    $scope.articleSearchTerm = '';
    $scope.searchArticleArray = [];
    $scope.sortNewOnTop = 'new to top';
    $scope.sortOldOnTop = 'old to top';// by default from server
    $scope.activeSort = $scope.sortOldOnTop;

    BlogService.get(function(blogs) {
        BlogService.blogsArray = blogs?blogs:[];
    },function(err){
        console.log(err)
    });

    /*SORT DON"T SAVE AFTER WE GO TO ANOTHER PAGE*/
    $scope.sortArticle = function(param) {
        $scope.activeSort = param;
        if(param === $scope.sortNewOnTop) {
          BlogService.blogsArray.sort(function(a, b) {
              return b.created - a.created
          });
      } else {
          BlogService.blogsArray.sort(function(a, b) {
              return a.created - b.created
          });
      }
        /* don't forget about search */
        $scope.articleSearch();
    };

    $scope.articleSearch = function(){
        if($scope.articleSearchTerm.trim()!=''){
            $scope.searchArticleArray = BlogService.blogsArray.filter(function(article){
                return article.title.indexOf($scope.articleSearchTerm)>=0 || article.text.indexOf($scope.articleSearchTerm)>=0
            })
        } else $scope.searchArticleArray = [];
    };

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
            $scope.article_in_progress = false;
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
                            $scope.article_in_progress = false;
                            $scope.articleErrorsFlag = false;
                            $scope.articleErrors = "";
                        },function(err){
                            $scope.article_in_progress = false;
                            $scope.articleErrorsFlag = true;
                            $scope.articleErrors = err;
                            console.log(err)
                        });
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
        }
    }
})
