angular.module('Scotty').controller('FilePageCtrl', function ($scope, $firebaseArray, projectDataService, $state,
                                                              $firebaseObject, Upload, $timeout, $log, $sce) {

    var ref = firebase.database().ref().child("documents");

    // create a synchronized array

    //TODO: display this
    var documents = $firebaseArray(ref);
    // $log.debug(documents);
    // $scope.projectDataService = projectDataService;

    // var projectkey = $scope.projectDataService.blockNumber + $scope.projectDataService.borough + $scope.projectDataService.lotNumber + Math.floor((Math.random() * 10) + 1);

    // var projectkey = Math.floor((Math.random() * 10) + 1);


     documents.$loaded().then(function (objects) {


        $log.debug('objects');
        $log.debug(objects);
        $scope.documents = objects;

        // $scope.currentProject = documents.$getRecord(projectkey);
        // $log.debug(documents.$indexFor(projectkey));
        // $log.debug($scope.currentProject);
        // $log.debug(projects.$getRecord(key1));
        // $log.debug(projects.$getRecord(key2));
        // $log.debug(projects.$getRecord(key3));
    });

     // $scope.addProject = function () {
    //
    //     documents.$loaded().then(function (tasks) {
    //
    //         if(documents.$indexFor(projectkey) > -1) {
    //             $log.debug("already exists");
    //         } else {
    //             $log.debug('ok adding');
    //
    //             ref.child(projectkey).set($scope.projectDataService);
    //             $scope.currentProject = documents.$getRecord(projectkey);
    //         }
    //     });
    // };

    $scope.approve = function(document){
        
    };

    $scope.reject = function(document){

    };

    
    // $scope.url2 = 'https://www.angularjs.org';
    var qwer = $sce.trustAsUrl('www.angularjs.org');
    console.log(qwer);
    $scope.url2 = $sce.getTrustedUrl(qwer);

    // $scope.url = $sce.trustAsResourceUrl('https://www.angularjs.org');
    // $scope.url = ($sce.getTrustedResourceUrl($scope.url));
    $scope.src = 'http://www.java2s.com/style/download.png';
    $scope.url = 'www.angularjs.org';

    $scope.changeIt = function () {
        $scope.url = $sce.trustAsResourceUrl('https://docs.angularjs.org/tutorial');
    };

    $scope.view = function(document){
        $log.debug('VIEW FUNCTION CALLED');
        $log.debug(document.url);

        // $scope.fileViewUrl = $sce.trustAsResourceUrl(document.url);
        $scope.myFile  = $sce.getTrustedResourceUrl($sce.trustAsResourceUrl(document.url));
        $log.debug($scope.myFile);

    };
    // $scope.submit = function () {
    //     if($scope.form.file.$valid && $scope.file) {
    //         $scope.upload($scope.file);
    //     }
    // };

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
        if($scope.file != null) {
            $scope.files = [$scope.file];
        }
    });
    $scope.log = '';

    // Create a root reference
    var storageRef = firebase.storage().ref();

// Create a reference to 'mountains.jpg'

// Create a reference to 'images/mountains.jpg'
//     var mountainImagesRef = storageRef.child('images/mountains.jpg');

    function uploadStorageToFirebase (file) {
        $log.debug('UPLOADING - ' + file.name);
        var fileRef = storageRef.child(file.name);

        fileRef.put(file).then(function (snapshot) {

            var fileRef = storageRef.child(file.name);

            $log.debug('Success --- Uploaded a blob or file!');
            $log.debug(snapshot.a);

            var documentData = {
                url: snapshot.a.downloadURLs["0"],
                contentType: snapshot.a.contentType,
                name: snapshot.a.name,
                timeCreated: snapshot.a.timeCreated,
                updated: snapshot.a.updated,
                md5: snapshot.a.md5Hash,
                status: 'Pending',
                details: ''
            };

            //TODO: create object in documents
            ref.child(snapshot.a.md5Hash).set(documentData);
            return true;
        });

    }

    $scope.upload = function (files) {
        if(files && files.length) {
            for(var i = 0; i < files.length; i++) {
                var file = files[i];
                $log.debug(file.$error);
                $log.debug(file);

                if(!file.$error) {
                    uploadStorageToFirebase(file);
                    //TODO: add UPloading animation
                    //TODO: add multiple support
                    $scope.files.splice($scope.files.indexOf(file), 1);
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
