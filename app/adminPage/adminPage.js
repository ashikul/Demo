angular.module('Scotty').controller('AdminpageCtrl', function ($scope,$firebaseArray ) {



    var ref = firebase.database().ref().child("projects");
    // create a synchronized array
    $scope.projects = $firebaseArray(ref);

});
