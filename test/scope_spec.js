'use strict';

var Scope = require('../src/scope');
describe('Scope', function() {
    it('can be constructed and used as an object', function() {
        var scope = new Scope();
        var propValue = 1;
        scope.aProperty = propValue;

        expect(scope.aProperty).toBe(propValue);
    });

    describe('digest', function() {
        var scope;

        beforeEach(function() {
            scope = new Scope();
        });

        it('calls the listener function of a watch on first $digest', function() {
            var watchFn = function() { 
                return 'wat'; 
            };
            var listenerFn = jasmine.createSpy('listenerFn');
            scope.$watch(watchFn, listenerFn);

            scope.$digest();

            expect(listenerFn).toHaveBeenCalled();
        });
    });
});