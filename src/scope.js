'use strict';
function initWatchVal() {}
var _ = require('lodash');
function Scope() {
    this.$$watchers = [];
}

Scope.prototype.$watch = function(watchFn, listenerFn) {
    var watcher = {
        watchFn: watchFn,
        listenerFn: listenerFn || function() {},
        lastVal: initWatchVal
    };
    this.$$watchers.push(watcher);
};

Scope.prototype.$digest = function() {
    _.forEach(this.$$watchers, function(watcher) {
        var newValue = watcher.watchFn(this);
        var lastValue = watcher.lastVal === initWatchVal ? newValue : watcher.lastVal;
        if (watcher.lastVal !== newValue) {

            watcher.listenerFn(newValue, lastValue, this);
            watcher.lastVal = newValue;
        }
    }.bind(this));
};

module.exports = Scope;