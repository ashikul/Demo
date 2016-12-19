(function () {

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
            // $scope.hey = 1212;

            // $scope.currentProject = documents.$getRecord(projectkey);
            // $log.debug(documents.$indexFor(projectkey));
            // $log.debug($scope.currentProject);
            // $log.debug(projects.$getRecord(key1));
            // $log.debug(projects.$getRecord(key2));
            // $log.debug(projects.$getRecord(key3));
            (function() {

                console.log('hello');
                console.log(document.getElementById('open-room'));


                document.getElementById('open-room').onclick = function() {
                    disableInputButtons();
                    connection.open(document.getElementById('room-id').value, function() {
                        showRoomURL(connection.sessionid);
                    });
                };

                document.getElementById('join-room').onclick = function() {
                    disableInputButtons();
                    connection.join(document.getElementById('room-id').value);
                };

                document.getElementById('open-or-join-room').onclick = function() {
                    disableInputButtons();
                    connection.openOrJoin(document.getElementById('room-id').value, function(isRoomExists, roomid) {
                        if(!isRoomExists) {
                            showRoomURL(roomid);
                        }
                    });
                };

                document.getElementById('btn-leave-room').onclick = function() {
                    this.disabled = true;

                    if(connection.isInitiator) {
                        // use this method if you did NOT set "autoCloseEntireSession===true"
                        // for more info: https://github.com/muaz-khan/RTCMultiConnection#closeentiresession
                        connection.closeEntireSession(function() {
                            document.querySelector('h1').innerHTML = 'Entire session has been closed.';
                        });
                    }
                    else {
                        connection.leave();
                    }
                };

// ......................................................
// ................FileSharing/TextChat Code.............
// ......................................................

                document.getElementById('share-file').onclick = function() {
                    var fileSelector = new FileSelector();
                    fileSelector.selectSingleFile(function(file) {
                        connection.send(file);
                    });
                };

                document.getElementById('input-text-chat').onkeyup = function(e) {
                    if (e.keyCode != 13) return;

                    // removing trailing/leading whitespace
                    this.value = this.value.replace(/^\s+|\s+$/g, '');
                    if (!this.value.length) return;

                    connection.send(this.value);
                    appendDIV(this.value);
                    this.value = '';
                };

                var chatContainer = document.querySelector('.chat-output');

                function appendDIV(event) {
                    var div = document.createElement('div');
                    div.innerHTML = event.data || event;
                    chatContainer.insertBefore(div, chatContainer.firstChild);
                    div.tabIndex = 0;
                    div.focus();

                    document.getElementById('input-text-chat').focus();
                }

// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................

                var connection = new RTCMultiConnection();

// by default, socket.io server is assumed to be deployed on your own URL
//    connection.socketURL = '/';
                connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

// comment-out below line if you do not have your own socket.io server
// connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

                connection.socketMessageEvent = 'audio-video-file-chat-demo';

                connection.enableFileSharing = true; // by default, it is "false".

                connection.session = {
                    audio: true,
                    video: true,
                    data: true
                };

                connection.sdpConstraints.mandatory = {
                    OfferToReceiveAudio: true,
                    OfferToReceiveVideo: true
                };

                connection.videosContainer = document.getElementById('videos-container');
                connection.onstream = function(event) {
                    var width = parseInt(connection.videosContainer.clientWidth / 2) - 20;
                    var mediaElement = getMediaElement(event.mediaElement, {
                        title: event.userid,
                        buttons: ['full-screen'],
                        width: width,
                        showOnMouseEnter: false
                    });

                    connection.videosContainer.appendChild(mediaElement);

                    setTimeout(function() {
                        mediaElement.media.play();
                    }, 5000);

                    mediaElement.id = event.streamid;
                };

                connection.onstreamended = function(event) {
                    var mediaElement = document.getElementById(event.streamid);
                    if(mediaElement) {
                        mediaElement.parentNode.removeChild(mediaElement);
                    }
                };

                connection.onmessage = appendDIV;
                connection.filesContainer = document.getElementById('file-container');

                connection.onopen = function() {
                    document.getElementById('share-file').disabled = false;
                    document.getElementById('input-text-chat').disabled = false;
                    document.getElementById('btn-leave-room').disabled = false;

                    document.querySelector('h1').innerHTML = 'You are connected with: ' + connection.getAllParticipants().join(', ');
                };

                connection.onclose = function() {
                    if(connection.getAllParticipants().length) {
                        document.querySelector('h1').innerHTML = 'You are still connected with: ' + connection.getAllParticipants().join(', ');
                    }
                    else {
                        document.querySelector('h1').innerHTML = 'Seems session has been closed or all participants left.';
                    }
                };

                connection.onEntireSessionClosed = function(event) {
                    document.getElementById('share-file').disabled = true;
                    document.getElementById('input-text-chat').disabled = true;
                    document.getElementById('btn-leave-room').disabled = true;

                    document.getElementById('open-or-join-room').disabled = false;
                    document.getElementById('open-room').disabled = false;
                    document.getElementById('join-room').disabled = false;
                    document.getElementById('room-id').disabled = false;

                    connection.attachStreams.forEach(function(stream) {
                        stream.stop();
                    });

                    // don't display alert for moderator
                    if(connection.userid === event.userid) return;
                    document.querySelector('h1').innerHTML = 'Entire session has been closed by the moderator: ' + event.userid;
                };

                connection.onUserIdAlreadyTaken = function(useridAlreadyTaken, yourNewUserId) {
                    // seems room is already opened
                    connection.join(useridAlreadyTaken);
                };

                function disableInputButtons() {
                    document.getElementById('open-or-join-room').disabled = true;
                    document.getElementById('open-room').disabled = true;
                    document.getElementById('join-room').disabled = true;
                    document.getElementById('room-id').disabled = true;

                }

// ......................................................
// ......................Handling Room-ID................
// ......................................................

                function showRoomURL(roomid) {
                    // var roomHashURL = '#' + roomid;
                    var roomQueryStringURL = '?roomid=' + roomid;

                    var html = '<h2>Unique URL for your room:</h2><br>';

                    // html += 'Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
                    html += '<br>';
                    html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';
                    html += 'Share link to invite';

                    var roomURLsDiv = document.getElementById('room-urls');
                    roomURLsDiv.innerHTML = html;

                    roomURLsDiv.style.display = 'block';
                }

                (function() {
                    var params = {},
                        r = /([^&=]+)=?([^&]*)/g;

                    function d(s) {
                        return decodeURIComponent(s.replace(/\+/g, ' '));
                    }
                    var match, search = window.location.search;
                    while (match = r.exec(search.substring(1)))
                        params[d(match[1])] = d(match[2]);
                    window.params = params;
                })();

                var roomid = '';
                if (localStorage.getItem(connection.socketMessageEvent)) {
                    roomid = localStorage.getItem(connection.socketMessageEvent);
                } else {
                    roomid = connection.token();
                }
                document.getElementById('room-id').value = roomid;
                document.getElementById('room-id').onkeyup = function() {
                    localStorage.setItem(connection.socketMessageEvent, this.value);
                };

                var hashString = location.hash.replace('#', '');
                if(hashString.length && hashString.indexOf('comment-') == 0) {
                    hashString = '';
                }

                var roomid = params.roomid;
                if(!roomid && hashString.length) {
                    roomid = hashString;
                }

                if(roomid && roomid.length) {
                    document.getElementById('room-id').value = roomid;
                    localStorage.setItem(connection.socketMessageEvent, roomid);

                    // auto-join-room
                    (function reCheckRoomPresence() {
                        connection.checkPresence(roomid, function(isRoomExists) {
                            if(isRoomExists) {
                                connection.join(roomid);
                                return;
                            }

                            setTimeout(reCheckRoomPresence, 5000);
                        });
                    })();


                    // disableInputButtons();
                }
            })();

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

        $scope.approve = function (document) {
            var d = documents.$getRecord(document.md5);
            d.status = 'Approved';
            documents.$save(d);
            // d.$save;
        };

        $scope.reject = function (document) {
            var d = documents.$getRecord(document.md5);
            d.status = 'Rejected';
            documents.$save(d);
        };

        $scope.view = function (document) {
            window.open(document.url, '_blank');
        };

        $scope.show = function (document) {
            $scope.pdf = $sce.trustAsResourceUrl(document.url);
            $log.debug($scope.pdf);
        };
        // $scope.trust = function (url) {
        //     return $sce.trustAsResourceUrl(url);
        //
        //                 // return $sce.getTrustedResourceUrl($sce.trustAsResourceUrl(url));
        //
        // };
        // $scope.url2 = 'https://www.angularjs.org';
        // var qwer = $sce.trustAsUrl('www.angularjs.org');
        // console.log(qwer);
        // $scope.url2 = $sce.getTrustedUrl(qwer);
        //
        // // $scope.url = $sce.trustAsResourceUrl('https://www.angularjs.org');
        // // $scope.url = ($sce.getTrustedResourceUrl($scope.url));
        // $scope.src = 'http://www.java2s.com/style/download.png';
        // $scope.url = 'www.angularjs.org';
        //
        // $scope.changeIt = function () {
        //     $scope.url = $sce.trustAsResourceUrl('https://docs.angularjs.org/tutorial');
        // };
        //

        //TODO: on file click
        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });
        $scope.$watch('file', function () {
            if($scope.file != null) {
                $scope.files = [$scope.file];
            }
        });
        // $scope.log = '';

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
})();