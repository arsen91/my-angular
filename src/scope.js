'use strict';
function initWatchVal() {}
var _ = require('lodash');
function Scope() {
    this.$$watchers = [];
    this.$$lastDirtyWatch = null;
}

Scope.prototype.$watch = function(watchFn, listenerFn) {
    var watcher = {
        watchFn: watchFn,
        listenerFn: listenerFn || function() {},
        lastVal: initWatchVal
    };
    this.$$watchers.push(watcher);
    this.$$lastDirtyWatch = null;
};

Scope.prototype.$$digestOnce = function() {
    var dirty, newValue, lastValue;
    _.forEach(this.$$watchers, function(watcher) {
        newValue = watcher.watchFn(this);
        lastValue = watcher.lastVal === initWatchVal ? newValue : watcher.lastVal;
        if (watcher.lastVal !== newValue) {
            this.$$lastDirtyWatch = watcher;
            watcher.listenerFn(newValue, lastValue, this);
            watcher.lastVal = newValue;
            dirty = true;
        } else if (this.$$lastDirtyWatch === watcher) {
            return false;
        }
    }.bind(this));
    return dirty;
};

Scope.prototype.$digest = function() {
    var dirty;
    var ttl = 10;
    this.$$lastDirtyWatch = null;
    do {
        dirty = this.$$digestOnce();
        if (dirty && !(ttl--)) {
            throw '10 digest iterations reached';
        }
    } while (dirty);
};

module.exports = Scope;