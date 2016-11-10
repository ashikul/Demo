angular.module('Scotty', ['ui.bootstrap', 'ui.router', 'firebase', 'ngFileUpload']);

angular.module('Scotty').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {


    // $stateProvider.state('homePage', {
    //     url: '/',
    //     templateUrl: 'app/homePage/homePage.html'
    // });
    $stateProvider.state('filePage', {
        url: '/',
        templateUrl: 'app/filePage/filePage.html'
    });
    // $stateProvider.state('projectPage', {
    //     url: '/project/',
    //     templateUrl: 'app/projectPage/projectPage.html'
    // });
    // $stateProvider.state('adminPage', {
    //     url: '/admin/',
    //     templateUrl: 'app/adminPage/adminPage.html'
    //
    // });
    /* Add New States Above */
    $urlRouterProvider.otherwise('/');

});

angular.module('Scotty').run(function ($rootScope) {

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
        // apiKey: "AIzaSyBYbbS3jNmLMYgip3ab2yjrYiAsL8_Xp4A",
        // authDomain: "countme-41154.firebaseapp.com",
        // databaseURL: "https://countme-41154.firebaseio.com",
        // storageBucket: "countme-41154.appspot.com",
        apiKey: "AIzaSyD3Z5y8TYvq75ewkwGzk5LqKUsjNNR7FQs",
        authDomain: "notary-fb8b1.firebaseapp.com",
        databaseURL: "https://notary-fb8b1.firebaseio.com",
        storageBucket: "notary-fb8b1.appspot.com",
        messagingSenderId: "903266716103"
    };
    firebase.initializeApp(config);

});



// angular.module('Scotty')
//     .config(function ($sceProvider, $compileProvider, $logProvider) {
//         $sceProvider.enabled(false);
//         // $logProvider.debugEnabled(false);
//         // $compileProvider.debugInfoEnabled(false);
//
//     });
// // //todo: put this in a file
// angular.module('Scotty')
//     .filter('trustAsResourceUrl', ['$sce', function ($sce) {
//         return function (val) {
//             return $sce.trustAsResourceUrl(val);
//             // return $sce.getTrustedResourceUrl($sce.trustAsResourceUrl(val));
//         };
//     }]);
