# Out of the box, HTMLStore's default accessor is _final_,
# meaning it can't change after the first `set`.
# Let's undo that:
storeAccessor = Batman.HTMLStore::_batman.getFirst('defaultAccessor')
storeAccessor.final = false

# And define an unset operation:
storeAccessor.unset = (path) ->
  if !path.charAt(0) is "/"
    path = "/#{path}"
  @_requestedPaths.remove(path)
  @_htmlContents[path] = undefined

# Climbs the view tree, looking for one that has a source
Batman.View::superviewWithSource = ->
  if @get('source')?
    return @
  else
    return @?superview.superviewWithSource()

# Refresh HTML by finding the next view with a source
# and refreshing subviews
Batman.View::refreshHTML = ->
  @sourceView ?= @superviewWithSource()
  if @sourceView?
    @_refreshSourceView()
  if @subviews?.length
    @_refreshSubviews()

Batman.View::_refreshSourceView = ->
  @sourceView.html = undefined
  path = @sourceView.get('source')
  if path.charAt(0) isnt "/"
    path = "/#{path}"
  return if path in Batman._refreshed
  Batman._refreshed.push(path)
  console.log "refreshing #{path}"
  Batman.View.store.unset(path)
  @sourceView._HTMLObserver ?= Batman.View.store.observe path, (nv, ov) =>
    @sourceView.set('html', nv)
    @sourceView.loadView()
    @sourceView.initializeBindings()

Batman.View::_refreshSubviews = ->
  @subviews.forEach (sv) ->
    if sv.get('source')?
      sv.refreshHTML()
    if sv.subviews?.length
      sv._refreshSubviews()

# Refresh all HTML, going down from `layout`
Batman.refreshHTML = ->
  Batman._refreshed = []
  Batman.currentApp.get('layout').refreshHTML()

# Refresh all CSS
Batman.refreshCSS = ->
  queryString = '?reload=' + new Date().getTime();
  refreshed = []
  $('link[rel="stylesheet"]').each ->
    if this.href.indexOf(window.location.host) > -1
      refreshed.push(this.href)
      this.href = this.href.replace(/\?.*|$/, queryString)
  console.log "refreshed \n#{refreshed.join("\n")}"
  undefined

# Refresh both
Batman.refreshAll = ->
  Batman.refreshHTML()
  Batman.refreshCSS()
