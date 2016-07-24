angular.module('CountMe').controller('HomepageCtrl', function ($scope, $uibModal) {



    $scope.displayModal = function () {

        var modalURL = 'app/modals/enterProject-modal/enterProject-modal.html';

        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: modalURL,
            controller: 'EnterprojectModalCtrl',


        });

    };

});
