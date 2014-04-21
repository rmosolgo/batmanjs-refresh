(function() {
  var storeAccessor,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  storeAccessor = Batman.HTMLStore.prototype._batman.getFirst('defaultAccessor');

  storeAccessor.final = false;

  storeAccessor.unset = function(path) {
    if (!path.charAt(0) === "/") {
      path = "/" + path;
    }
    this._requestedPaths.remove(path);
    return this._htmlContents[path] = void 0;
  };

  Batman.View.prototype.superviewWithSource = function() {
    if (this.get('source') != null) {
      return this;
    } else {
      return typeof this === "function" ? this(superview.superviewWithSource()) : void 0;
    }
  };

  Batman.View.prototype.refreshHTML = function() {
    var _ref;
    if (this.sourceView == null) {
      this.sourceView = this.superviewWithSource();
    }
    if (this.sourceView != null) {
      this._refreshSourceView();
    }
    if ((_ref = this.subviews) != null ? _ref.length : void 0) {
      return this._refreshSubviews();
    }
  };

  Batman.View.prototype._refreshSourceView = function() {
    var path, _base;
    this.sourceView.html = void 0;
    path = this.sourceView.get('source');
    if (path.charAt(0) !== "/") {
      path = "/" + path;
    }
    if (__indexOf.call(Batman._refreshed, path) >= 0) {
      return;
    }
    Batman._refreshed.push(path);
    console.log("refreshing " + path);
    Batman.View.store.unset(path);
    return (_base = this.sourceView)._HTMLObserver != null ? _base._HTMLObserver : _base._HTMLObserver = Batman.View.store.observe(path, (function(_this) {
      return function(nv, ov) {
        _this.sourceView.set('html', nv);
        _this.sourceView.loadView();
        return _this.sourceView.initializeBindings();
      };
    })(this));
  };

  Batman.View.prototype._refreshSubviews = function() {
    return this.subviews.forEach(function(sv) {
      var _ref;
      if (sv.get('source') != null) {
        sv.refreshHTML();
      }
      if ((_ref = sv.subviews) != null ? _ref.length : void 0) {
        return sv._refreshSubviews();
      }
    });
  };

  Batman.refreshHTML = function() {
    Batman._refreshed = [];
    return Batman.currentApp.get('layout').refreshHTML();
  };

  Batman.refreshCSS = function() {
    var queryString, refreshed;
    queryString = '?reload=' + new Date().getTime();
    refreshed = [];
    $('link[rel="stylesheet"]').each(function() {
      if (this.href.indexOf(window.location.host) > -1) {
        refreshed.push(this.href);
        return this.href = this.href.replace(/\?.*|$/, queryString);
      }
    });
    console.log("refreshed \n" + (refreshed.join("\n")));
    return void 0;
  };

  Batman.refreshAll = function() {
    Batman.refreshHTML();
    return Batman.refreshCSS();
  };

}).call(this);
