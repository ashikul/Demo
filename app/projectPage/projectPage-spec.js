describe('ProjectpageCtrl', function () {

    beforeEach(module('CountMe'));

    var scope, ctrl;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        ctrl = $controller('ProjectpageCtrl', {$scope: scope});
    }));

    it('should ...', inject(function () {

        expect(1).toEqual(1);

    }));

});
