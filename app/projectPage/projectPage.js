angular.module('Scotty').controller('ProjectpageCtrl', function ($scope, projectDataService, $state,
                                                                 $firebaseObject, $firebaseArray) {

    // var ref = firebase.database().ref();
    // $scope.data = $firebaseObject(ref);

    var ref = firebase.database().ref().child("projects");

    // create a synchronized array
    var projects = $firebaseArray(ref);
    $scope.projectDataService = projectDataService;
    var projectkey = $scope.projectDataService.blockNumber + $scope.projectDataService.borough + $scope.projectDataService.lotNumber + Math.floor((Math.random() * 10) + 1);

    projects.$loaded().then(function (tasks) {

        $scope.currentProject = projects.$getRecord(projectkey);
        console.log(projects.$indexFor(projectkey));
        // console.log($scope.currentProject);
        // console.log(projects.$getRecord(key1));
        // console.log(projects.$getRecord(key2));
        // console.log(projects.$getRecord(key3));
    });

    $scope.addProject = function () {

        projects.$loaded().then(function (tasks) {

            if(projects.$indexFor(projectkey) > -1) {
                console.log("already exists");
                alert("already exists");
            } else {
                console.log('ok adding');
                alert("adding");

                ref.child(projectkey).set($scope.projectDataService);
                $scope.currentProject = projects.$getRecord(projectkey);
            }
        });

    };

    $scope.goToAdminPage = function () {

        $state.go('adminPage');
    };

});
