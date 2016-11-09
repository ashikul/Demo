angular.module('Scotty').controller('FilePageCtrl', function ($scope, $firebaseArray, projectDataService, $state,
                                                              $firebaseObject, Upload, $timeout, $log) {

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
        $log.debug(documents.$indexFor(projectkey));
        // $log.debug($scope.currentProject);
        // $log.debug(projects.$getRecord(key1));
        // $log.debug(projects.$getRecord(key2));
        // $log.debug(projects.$getRecord(key3));
    });



    //TODO: add file to storage
    $scope.addProject = function () {

        documents.$loaded().then(function (tasks) {

            if(documents.$indexFor(projectkey) > -1) {
                $log.debug("already exists");
            } else {
                $log.debug('ok adding');

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


    // $log.debug($scope.uploadedFiles);
    // $log.debug($scope.invalidFiles);
    // $log.debug($scope.disabledUpload);
    // $log.debug($scope.maxFiles);
    // $log.debug($scope.dropAvailable);



    
    //TODO: on file click
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.$watch('file', function () {
        if ($scope.file != null) {
            $scope.files = [$scope.file];
        }
    });
    $scope.log = '';


    // Create a root reference
    var storageRef = firebase.storage().ref();

// Create a reference to 'mountains.jpg'

// Create a reference to 'images/mountains.jpg'
    var mountainImagesRef = storageRef.child('images/mountains.jpg');

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                $log.debug(file.$error);
                $log.debug(file);
             

                if (!file.$error) {

                    var fileRef = storageRef.child(file.name);

                    fileRef.put(file).then(function(snapshot) {
                        $log.debug('Uploaded a blob or file!');
                        $log.debug(snapshot);

                        
                    // Upload.upload({
                    //     url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                    //     data: {
                    //         username: $scope.username,
                    //         file: file
                    //     }
                    }).then(function (resp) {
                        $timeout(function() {
                            $log.debug(resp);
                            $scope.log = 'file: ' +
                                resp.config.data.file.name +
                                ', Response: ' + JSON.stringify(resp.data) +
                                '\n' + $scope.log;
                        });
                    }, null, function (evt) {
                        var progressPercentage = parseInt(100.0 *
                            evt.loaded / evt.total);
                        $scope.log = 'progress: ' + progressPercentage +
                            '% ' + evt.config.data.file.name + '\n' +
                            $scope.log;
                    });
                }
            }
        }
    };
    // $scope.uploadFiles = function(files, errFiles) {
    //     $scope.files = files;
    //     $scope.errFiles = errFiles;
    //     angular.forEach(files, function(file) {
    //         file.upload = Upload.upload({
    //             url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
    //             data: {file: file}
    //         });
    //
    //         file.upload.then(function (response) {
    //             $timeout(function () {
    //                 file.result = response.data;
    //             });
    //         }, function (response) {
    //             if (response.status > 0)
    //                 $scope.errorMsg = response.status + ': ' + response.data;
    //         }, function (evt) {
    //             file.progress = Math.min(100, parseInt(100.0 *
    //                 evt.loaded / evt.total));
    //         });
    //     });
    // }




});
