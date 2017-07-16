/**
 * Created by sbrilenko on 7/12/2017.
 */
testApp.service('BlogService', ['Restangular','User', function(Restangular, User) {

    this.blogsArray = [];
    this.articleCreate = function(form_data, success_function, error_function) {
        Restangular.setDefaultHeaders({
            'Token': User.getToken()
        }).one('blog').customPOST(form_data)
            .then(success_function)
            .catch(error_function);
    };
    this.articleEdit = function(form_data, success_function, error_function) {
        Restangular.setDefaultHeaders({
            'Token': User.getToken()
        }).one('blog',form_data.id).customPUT(form_data)
            .then(success_function)
            .catch(error_function);
    };
    this.get = function(success_function, error_function) {
        Restangular.one('blog').customGET()
            .then(success_function)
            .catch(error_function);
    };
    this.remove = function(postId, success_function, error_function) {
        Restangular.setDefaultHeaders({
            'Token': User.getToken()
        }).one('blog',postId).remove()
            .then(success_function)
            .catch(error_function);
    };

    this.findArticle = function(postId, success_function, error_function) {
        Restangular.one('blog',postId).get()
            .then(success_function)
            .catch(error_function);
    }

}]);

