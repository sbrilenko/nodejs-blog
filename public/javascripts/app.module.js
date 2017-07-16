/**
 * Created by sbrilenko on 12/07/17.
 */
var testApp = angular.module('testApp', [
    'ngCookies',
    'ngRoute',
    'ngDialog',
    'restangular',
    'validation.match',
    'angularMoment'
]);

testApp.factory('httpRequestInterceptor', ['$q', '$injector' ,function ($q, $injector) {
    return {
        'responseError': function(rejection) {
            // do something on error
            if(rejection.status === 403){
                /* use $injector because in User we have Restangular($http) */
                $injector.get('User').logout();
            }
            return $q.reject(rejection);
        }
    };
}]);
testApp.config(function(RestangularProvider, $httpProvider) {
    RestangularProvider.setBaseUrl(testApp.BACKEND_BASE_API_URL);
    $httpProvider.interceptors.push('httpRequestInterceptor');
});

testApp.config(function($cookiesProvider) {
		const current_hostname = window.location.hostname;
		if (current_hostname != 'localhost') {
				$cookiesProvider.defaults.domain = '.' + current_hostname;
		}
});
