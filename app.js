var loginApp = angular.module('loginApp', ['ui.router', 'ui.bootstrap'])
/*Constants regarding user login defined here*/
.constant('USER_ROLES', {
    all : '*',
    admin : 'admin',
    editor : 'editor',
    guest : 'guest'
}).constant('AUTH_EVENTS', {
    loginSuccess : 'auth-login-success',
    loginFailed : 'auth-login-failed',
    logoutSuccess : 'auth-logout-success',
    sessionTimeout : 'auth-session-timeout',
    notAuthenticated : 'auth-not-authenticated',
    notAuthorized : 'auth-not-authorized'
})

angular.module('loginApp')
.factory('Auth', [ '$http', '$rootScope', '$window', 'Session', 'AUTH_EVENTS', 
function($http, $rootScope, $window, Session, AUTH_EVENTS) {

authService.login() = [...]
authService.isAuthenticated() = [...]
authService.isAuthorized() = [...]
authService.logout() = [...]

return authService;
} ]);

angular.module('loginApp').service('Session', function($rootScope, USER_ROLES) {

    this.create = function(user) {
        this.user = user;
        this.userRole = user.userRole;
    };
    this.destroy = function() {
        this.user = null;
        this.userRole = null;
    };
    return this;
});
.config(function ($stateProvider, USER_ROLES) {
  $stateProvider.state('dashboard', {
    url: '/dashboard',
    templateUrl: 'dashboard/index.html',
    data: {
      authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
    }
  });
})

$rootScope.$in('$stateChangeStart', function (event, next) {
    var authorizedRoles = next.data.authorizedRoles;
    if (!Auth.isAuthorized(authorizedRoles)) {
      event.preventDefault();
      if (Auth.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
});

angular.module('loginApp')
.factory('AuthInterceptor', [ '$rootScope', '$q', 'Session', 'AUTH_EVENTS',
function($rootScope, $q, Session, AUTH_EVENTS) {
    return {
        responseError : function(response) {
            $rootScope.$broadcast({
                401 : AUTH_EVENTS.notAuthenticated,
                403 : AUTH_EVENTS.notAuthorized,
                419 : AUTH_EVENTS.sessionTimeout,
                440 : AUTH_EVENTS.sessionTimeout
            }[response.status], response);
            return $q.reject(response);
        }
    };
} ]);
