describe('EnterprojectModalCtrl', function() {

    beforeEach(module('Scotty'));

    var scope,ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('EnterprojectModalCtrl', {$scope: scope});
    }));

    it('should ...', inject(function() {

        expect(1).toEqual(1);

    }));

});
