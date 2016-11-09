angular.module('Scotty').factory('projectDataService',function() {

    var projectDataService = {
        fullName: '',
        emailAddress: '',
        taxNumber: 0,
        lotNumber: 0,
        blockNumber: 0,
        borough:''
    };

    return projectDataService;
});
