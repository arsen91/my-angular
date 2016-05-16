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

        it('calls the watch function with the scope as the argument', function() {
            var watchFn = jasmine.createSpy('watchFn');
            var listenerFn = function() {};
            scope.$watch(watchFn, listenerFn);
            scope.$digest();
            expect(watchFn).toHaveBeenCalledWith(scope);
        });

        it('calls the listener function when the watched value changes', function() {
            scope.someValue = 'a';
            scope.counter = 0;
            scope.$watch(
                function(scope) { return scope.someValue; },
                function(newValue, oldValue, scope) { scope.counter++; }
            );

            expect(scope.counter).toBe(0);
            scope.$digest();
            expect(scope.counter).toBe(1);
            scope.$digest();
            expect(scope.counter).toBe(1);
            scope.someValue = 'b';
            expect(scope.counter).toBe(1);
            scope.$digest();
            expect(scope.counter).toBe(2);
        });
    });
});