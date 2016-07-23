angular.module('CountMe', ['ui.bootstrap','ui.router','ngAnimate']);

angular.module('CountMe').config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('homePage', {
        url: '/',
        templateUrl: 'app/homePage/homePage.html'
    });
    /* Add New States Above */
    $urlRouterProvider.otherwise('/home');

});

angular.module('CountMe').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
