angular.module('Scotty').controller('FilePageCtrl', function ($scope, $firebaseArray, projectDataService, $state,
                                                              $firebaseObject, Upload) {

    var ref = firebase.database().ref().child("documents");

    // create a synchronized array

    //TODO: display this
    var documents = $firebaseArray(ref);
    // $scope.projectDataService = projectDataService;

    // var projectkey = $scope.projectDataService.blockNumber + $scope.projectDataService.borough + $scope.projectDataService.lotNumber + Math.floor((Math.random() * 10) + 1);

    var projectkey = Math.floor((Math.random() * 10) + 1);

    //TODO: display
    documents.$loaded().then(function (tasks) {

        $scope.currentProject = documents.$getRecord(projectkey);
        console.log(documents.$indexFor(projectkey));
        // console.log($scope.currentProject);
        // console.log(projects.$getRecord(key1));
        // console.log(projects.$getRecord(key2));
        // console.log(projects.$getRecord(key3));
    });



    //TODO: add file to storage
    $scope.addProject = function () {

        documents.$loaded().then(function (tasks) {

            if(documents.$indexFor(projectkey) > -1) {
                console.log("already exists");
            } else {
                console.log('ok adding');

                ref.child(projectkey).set($scope.projectDataService);
                $scope.currentProject = documents.$getRecord(projectkey);
            }
        });

    };

    $scope.submit = function() {
        if ($scope.form.file.$valid && $scope.file) {
            $scope.upload($scope.file);
        }
    };


    console.log($scope.uploadedFiles);
    console.log($scope.invalidFiles);
    console.log($scope.disabledUpload);
    console.log($scope.maxFiles);
    console.log($scope.dropAvailable);
    console.log($scope.invalidFiles);
    console.log($scope.invalidFiles);
    console.log($scope.invalidFiles);
    console.log($scope.invalidFiles);

    
    //TODO: on file click





});
