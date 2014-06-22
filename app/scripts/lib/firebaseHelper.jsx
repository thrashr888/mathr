'use strict';

// This code is taken from here:
// https://www.firebase.com/blog/2014-05-06-synchronized-arrays.html

var FirebaseHelper = {

  getSynchronizedObject: function getSynchronizedObject(firebaseRef, cb) {
    var obj = {};
    this.syncObjectChanges(obj, firebaseRef, cb);

    obj.$remove = function(key) {
      firebaseRef.child(key).remove();
    };
    obj.$set = function(key, newData) {
      // make sure we don't accidentally push our $id prop
      if( newData.hasOwnProperty('$id') ) { delete newData.$id; }
      firebaseRef.child(key).set(newData);
    };
    return obj;
  },

  syncObjectChanges: function syncChanges(obj, ref, cb) {
    ref.on('value', function _add(snap, prevChild) {
      var data = snap.val();
      data.$id = snap.name(); // assumes data is always an object
      for (var i in data) {
        obj[i] = data[i];
      }
      cb();
    }.bind(this));
  },

  getSynchronizedArray: function getSynchronizedArray(firebaseRef, cb) {
    var list = [];
    this.syncChanges(list, firebaseRef, cb);
    this.wrapLocalCrudOps(list, firebaseRef);
    return list;
  },

  syncChanges: function syncChanges(list, ref, cb) {
    ref.on('child_added', function _add(snap, prevChild) {
      var data = snap.val();
      data.$id = snap.name(); // assumes data is always an object
      var pos = this._positionAfter(list, prevChild);
      list.splice(pos, 0, data);
      cb();
    }.bind(this));

    ref.on('child_removed', function _remove(snap) {
      var i = this._positionFor(list, snap.name());
      if( i > -1 ) {
        list.splice(i, 1);
      }
      cb();
    }.bind(this));

    ref.on('child_changed', function _change(snap) {
      var i = this._positionFor(list, snap.name());
      if( i > -1 ) {
        list[i] = snap.val();
        list[i].$id = snap.name(); // assumes data is always an object
      }
      cb();
    }.bind(this));

    ref.on('child_moved', function _move(snap, prevChild) {
      var curPos = this._positionFor(list, snap.name());
      if( curPos > -1 ) {
        var data = list.splice(curPos, 1)[0];
        var newPos = this._positionAfter(list, prevChild);
        list.splice(newPos, 0, data);
      }
      cb();
    }.bind(this));
  },

  // similar to indexOf, but uses id to find element
  _positionFor: function _positionFor(list, key) {
    for(var i = 0, len = list.length; i < len; i++) {
      if( list[i].$id === key ) {
        return i;
      }
    }
    return -1;
  },

  // using the Firebase API's prevChild behavior, we
  // place each element in the list after it's prev
  // sibling or, if prevChild is null, at the beginning
  _positionAfter: function _positionAfter(list, prevChild) {
    if( prevChild === null ) {
      return 0;
    }
    else {
      var i = this._positionFor(list, prevChild);
      if( i === -1 ) {
        return list.length;
      }
      else {
        return i+1;
      }
    }
  },

  wrapLocalCrudOps: function wrapLocalCrudOps(list, firebaseRef) {
     // we can hack directly on the array to provide some convenience methods
     list.$add = function(data) {
        return firebaseRef.push(data);
     };
     list.$remove = function(key) {
       firebaseRef.child(key).remove();
     };
     list.$set = function(key, newData) {
       // make sure we don't accidentally push our $id prop
       if( newData.hasOwnProperty('$id') ) { delete newData.$id; }
       firebaseRef.child(key).set(newData);
     };
     list.$indexOf = function(key) {
       return this._positionFor(list, key); // _positionFor in examples above
     };
  }
};

module.exports = FirebaseHelper;