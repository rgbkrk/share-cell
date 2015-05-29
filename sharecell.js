ShareCell = function(code, kernel_name, nburl) {
  // Check Location
  if ( document.location.protocol === 'file:' ) {
    alert("The HTML5 History API doesn't work on files, please use a local server. I'd recommend node's http-server.");
  }

  this.thebe = new Thebe({
    url: nburl,
    kernel_name: kernel_name
  });

  var initialState = this.state(code, kernel_name);

  this.replaceState(initialState);
  history.replaceState(initialState, document.title, document.location.href);

};

/**
 * Retrieve a state represented by
 */
ShareCell.prototype.state = function(code, kernel_name, outputs) {
    return {
      code: code || this.thebe.cells[0].get_text(),
      kernel_name: kernel_name || this.thebe.options.kernel_name,
      // Despite the name, this is a full object
      outputs: outputs || this.thebe.cells[0].output_area.toJSON()
    };
};

/**
 * replaces the current thebe state
 */
ShareCell.prototype.replaceState = function(state) {
  this.thebe.cells[0].set_text(state.code);
  //TODO: Update thebe's kernel_name

  // Clear old output first
  this.thebe.cells[0].output_area.clear_output();
  // Restore outputs
  if (state.outputs) {
    this.thebe.cells[0].output_area.fromJSON(state.outputs);
  }
};

ShareCell.prototype.path = function() {
  var state = this.state();
  var newLoc = "?code=" + encodeURIComponent(state.code);
  newLoc = newLoc + "&kernel_name=" + state.kernel_name;

  if(JSON.stringify(history.state) !== JSON.stringify(state)) {
    history.pushState(state, null, newLoc);
  } else {
    console.log("Cell still the same, not changing history.");
  }

  return newLoc;
};



/**
 * Returns a bare object of the URL's query parameters.
 * You can pass just a query string rather than a complete URL.
 * The default URL is the current page.
 *
 * From: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 */
var getUrlParams = function(url) {
    // http://stackoverflow.com/a/23946023/2407309
    if (typeof url == 'undefined') {
        url = window.location.search;
    }
    url = url.split('#')[0]; // Discard fragment identifier.
    var queryString = url.split('?')[1];
    if (!queryString) {
        if (url.search('=') !== false) {
            queryString = url;
        }
    }
    var urlParams = {};
    if (queryString) {
        var keyValuePairs = queryString.split('&');
        for (var i = 0; i < keyValuePairs.length; i++) {
            var keyValuePair = keyValuePairs[i].split('=');
            var paramName = keyValuePair[0];
            var paramValue = keyValuePair[1] || '';
            urlParams[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '));
        }
    }
    return urlParams;
}; // getUrlParams
