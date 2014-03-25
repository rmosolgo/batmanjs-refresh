(function() {
  var storeAccessor;

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
      return this.superview.superviewWithSource();
    }
  };

  Batman.View.prototype.refreshHTML = function() {
    var path, sourceView;
    if (this.sourceView == null) {
      this.sourceView = this.superviewWithSource();
    }
    sourceView = this.sourceView;
    sourceView.html = void 0;
    path = sourceView.get('source');
    if (path.charAt(0) !== "/") {
      path = "/" + path;
    }
    console.log("refreshing " + path);
    Batman.View.store.unset(path);
    return sourceView._HTMLObserver != null ? sourceView._HTMLObserver : sourceView._HTMLObserver = Batman.View.store.observe(path, (function(_this) {
      return function(nv, ov) {
        sourceView.set('html', nv);
        sourceView.loadView();
        return sourceView.initializeBindings();
      };
    })(this));
  };

  Batman.refreshHTML = function() {
    return Batman.currentApp.get('layout.subviews').filter(function(sv) {
      return sv.get('source') != null;
    }).forEach(function(sv) {
      return sv.refreshHTML();
    });
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
