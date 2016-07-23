angular.module('CountMe', ['ui.bootstrap','ui.router','ngAnimate']);

angular.module('CountMe').config(function($stateProvider, $urlRouterProvider, $locationProvider) {


    $stateProvider.state('homePage', {
        url: '/',
        templateUrl: 'app/homePage/homePage.html'
    });
    $stateProvider.state('projectPage', {
        url: '/project/:id',
        templateUrl: 'app/projectPage/projectPage.html'
    });
    $stateProvider.state('adminPage', {
        url: '/admin/',
        templateUrl: 'app/adminPage/adminPage.html'
    });
    /* Add New States Above */
    $urlRouterProvider.otherwise('/');


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
