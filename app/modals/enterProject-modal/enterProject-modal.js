angular.module('Scotty').controller('EnterprojectModalCtrl',function($scope, $uibModalInstance, $state, projectDataService){


    $scope.close = function () {
        $uibModalInstance.close();
    };

    $scope.submit = function () {

        projectDataService.fullName = 'John Doe';
        projectDataService.emailAddress ='test@test.com';
        projectDataService.taxNumber = Math.floor((Math.random() * 1000) + 1);
        projectDataService.lotNumber = Math.floor((Math.random() * 1000) + 1);
        projectDataService.blockNumber = Math.floor((Math.random() * 1000) + 1);
        projectDataService.borough = 'Queens';
        $state.go('projectPage');
        $uibModalInstance.close();
    };


    });
