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
    return @superview.superviewWithSource()

# Climbs the view try to find a souce, then refreshes it.
Batman.View::refreshHTML = ->
  @sourceView ?= @superviewWithSource()
  sourceView = @sourceView
  sourceView.html = undefined
  path = sourceView.get('source')
  if path.charAt(0) isnt "/"
    path = "/#{path}"
  console.log "refreshing #{path}"
  Batman.View.store.unset(path)
  sourceView._HTMLObserver ?= Batman.View.store.observe path, (nv, ov) =>
    sourceView.set('html', nv)
    sourceView.loadView()
    sourceView.initializeBindings()

# Tries to refresh all children of the layout view
Batman.refreshHTML = ->
  Batman.currentApp
    .get('layout.subviews')
    .filter((sv) -> sv.get('source')?)
    .forEach((sv) -> sv.refreshHTML())

# Reload stylesheets
# from stackoverflow.com/questions/2024486/is-there-an-easy-way-to-reload-css-without-reloading-the-page
Batman.refreshCSS = ->
  queryString = '?reload=' + new Date().getTime();
  refreshed = []
  $('link[rel="stylesheet"]').each ->
    if this.href.indexOf(window.location.host) > -1
      refreshed.push(this.href)
      this.href = this.href.replace(/\?.*|$/, queryString)
  console.log "refreshed \n#{refreshed.join("\n")}"
  undefined

# Reload the children of the layout and reload stylesheets
Batman.refreshAll = ->
  Batman.refreshHTML()
  Batman.refreshCSS()
