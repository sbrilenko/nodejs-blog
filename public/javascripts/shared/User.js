/**
 * Created by sbrilenko on 7/12/2017.
 */
testApp.service('User', ['$cookies', 'Restangular', '$location', function($cookies, Restangular, $location) {
    this.token = null;
    this.email = '';

    this.isAuthorizated = function(){
        return this.getToken()?true:false;
    };

    this.getToken = function() {
        var token = $cookies.get('test-user-token');
        if(token) return token;
        this.token = null;
        return null;
    };

    this.saveToken = function(token) {
        $cookies.put('test-user-token', token);
    };

    this.resetToken = function() {
        $cookies.remove('test-user-token');
        this.token = null;
    };

    this.getEmail = function() {
        var email = $cookies.get('test-user-email');
        if(email) return email;
        this.email = ''
        return null;
    };

    this.saveEmail = function(email) {
        $cookies.put('test-user-email', email);
    };

    this.resetEmail = function() {
        $cookies.remove('test-user-email');
        this.email = '';
    };

    /**
     * registration
     *
     * @param form_data
     * @param success_function
     * @param error_function
     */
    this.registration = function(form_data, success_function, error_function) {
        Restangular.all('auth').one('signup').customPOST(form_data)
            .then(success_function)
            .catch(error_function);
    };


    /**
     * auth
     *
     * @param email
     * @param password
     * @param success_function
     * @param error_function
     */
    this.auth = function(email, password, success_function, error_function){
        var self = this;
        if(!this.token){
            Restangular
                .all("auth").one("signin").customPOST({email: email,password:password})
                .then(function(response){
                    success_function(response, self);
                })
                .catch(error_function);
        }else{
            error_function()
        }
    };

    /**
     * logout
     *
     */
    this.logout = function() {
        var self = this;
        if (this.token) {
            Restangular.setDefaultHeaders({'Token': self.getToken()})
                .all('auth').one('logout').post().then(function (response) {
                /*reset tokens*/
                self.resetToken();
                self.resetEmail();
                $location.path("/");
            })
                .catch(function () {
                    self.resetToken();
                    self.resetEmail();
                    $location.path("/");
                });
        } else {
            self.resetToken();
            self.resetEmail();
            $location.path("/");
        }
    };

}]);