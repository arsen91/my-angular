'use strict';
var _ = require('lodash');
function Scope() {
    this.$$watchers = [];
}

Scope.prototype.$watch = function(watchFn, listenerFn) {
    var watcher = {
        watchFn: watchFn,
        listenerFn: listenerFn
    };
    this.$$watchers.push(watcher);
};

Scope.prototype.$digest = function() {
    _.forEach(this.$$watchers, function(watcher) {
        var newValue = watcher.watchFn(this);
        if (watcher.lastVal !== newValue) {
            watcher.listenerFn(newValue, watcher.lastVal, this);
            watcher.lastVal = newValue;
        }
    }.bind(this));
};

module.exports = Scope;