# Batman Refresh

Batman Refresh ([JavaScript](https://raw.githubusercontent.com/rmosolgo/batmanjs-refresh/master/refresh.js), [CoffeeScript](https://raw.githubusercontent.com/rmosolgo/batmanjs-refresh/master/refresh.coffee)) is an add-on to batman.js to help your development workflow. It adds a few functions:

- `Batman.refreshHTML` reloads the `source` for all subviews of the layout view:
  ```javascript
  Batman.refreshHTML()
  ```
- `Batman.refreshCSS` reloads all stylesheets on the page
  ```javascript
  Batman.refreshCSS()
  ```
- `Batman.refreshAll` does both!
  ```javascript
  Batman.refreshAll()
  ```

Also, you can use `Batman.View::refreshHTML` to refresh the HTML for a specific view. For example:

```javascript
myNode = document.getElementById("my-node")
view = $context(myNode)
view.refreshHTML() // reloads HTML from the server
```

No tests, no docs, but there is [annotated source code](http://rmosolgo.github.io/batmanjs-refresh/refresh.html) :)
