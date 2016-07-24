angular.module('CountMe', ['ui.bootstrap', 'ui.router', 'ngAnimate', 'firebase']);

angular.module('CountMe').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider.state('homePage', {
        url: '/',
        templateUrl: 'app/homePage/homePage.html'
    });
    $stateProvider.state('projectPage', {
        url: '/project/',
        templateUrl: 'app/projectPage/projectPage.html'
    });
    $stateProvider.state('adminPage', {
        url: '/admin/',
        templateUrl: 'app/adminPage/adminPage.html'
 
    });
    /* Add New States Above */
    $urlRouterProvider.otherwise('/');

});

angular.module('CountMe').run(function ($rootScope) {

    $rootScope.safeApply = function (fn) {
        var phase = $rootScope.$$phase;
        if(phase === '$apply' || phase === '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBYbbS3jNmLMYgip3ab2yjrYiAsL8_Xp4A",
        authDomain: "countme-41154.firebaseapp.com",
        databaseURL: "https://countme-41154.firebaseio.com",
        storageBucket: "countme-41154.appspot.com",
    };
    firebase.initializeApp(config);

});
