angular.module('CountMe').controller('HomepageCtrl', function ($scope, $uibModal) {



    $scope.displayModal = function () {


        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: '../app/modals/enterProject-modal/enterProject-modal.html',
            controller: 'EnterprojectModalCtrl',
   
        });

    };

});
