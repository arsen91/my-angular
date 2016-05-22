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

Scope.prototype.$$digestOnce = function() {
    var dirty, newValue, lastValue;
    _.forEach(this.$$watchers, function(watcher) {
        newValue = watcher.watchFn(this);
        lastValue = watcher.lastVal === initWatchVal ? newValue : watcher.lastVal;
        if (watcher.lastVal !== newValue) {
            watcher.listenerFn(newValue, lastValue, this);
            watcher.lastVal = newValue;
            dirty = true;
        }
    }.bind(this));
    return dirty;
};

Scope.prototype.$digest = function() {
    var dirty;
    var ttl = 10;
    do {
        dirty = this.$$digestOnce();
        if (dirty && !(ttl--)) {
            throw '10 digest iterations reached';
        }
    } while (dirty);
};

module.exports = Scope;