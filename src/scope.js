'use strict';
function initWatchVal() {}
var _ = require('lodash');
function Scope() {
    this.$$watchers = [];
    this.$$lastDirtyWatch = null;
}

Scope.prototype.$watch = function(watchFn, listenerFn, deepWatch) {
    var watcher = {
        watchFn: watchFn,
        listenerFn: listenerFn || function() {},
        lastVal: initWatchVal,
        deepWatch: !!deepWatch
    };
    this.$$watchers.push(watcher);
    this.$$lastDirtyWatch = null;
    return function() {
        var index = this.$$watchers.indexOf(watcher);
        if (index >= 0) {
            this.$$watchers.splice(index, 1);
        }
    }.bind(this);
};

Scope.prototype.$$digestOnce = function() {
    var dirty, newValue, lastValue;
    _.forEach(this.$$watchers, function(watcher) {
        try {
            newValue = watcher.watchFn(this);
            lastValue = watcher.lastVal;
            if (!this.$$areEqual(newValue, lastValue, watcher.deepWatch)) {
                this.$$lastDirtyWatch = watcher;
                watcher.listenerFn(newValue, 
                    (watcher.lastVal === initWatchVal ? newValue : watcher.lastVal),
                    this);
                watcher.lastVal = (watcher.deepWatch ? _.cloneDeep(newValue) : newValue);
                dirty = true;
            } else if (this.$$lastDirtyWatch === watcher) {
                return false;
            }
        } catch (e) {
            console.error(e);
        }
    }.bind(this));
    return dirty;
};

Scope.prototype.$$areEqual = function(newValue, oldValue, deepWatch) {
    if (deepWatch) {
        return _.isEqual(newValue, oldValue);
    } else {
        return newValue === oldValue ||
            (typeof newValue === 'number' && typeof oldValue === 'number' && isNaN(newValue) && isNaN(oldValue));
    }
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