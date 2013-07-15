var util = require('util'),
    colors = require('colors'),
    http = require('follow-redirects').http,
    https = require('follow-redirects').https;

// Mitm Module
var Mitm = (function() {
  var beforeMiddlewares = [],
      frameMiddlewares = [],
      afterMiddlewares = [];

  // public interface
  publicInterface = {
    start: function(port) {
      http.createServer(listener).listen(port);
      util.puts('mitm server '.blue + 'started '.green.bold + 'on port '.blue + port.toString().yellow);
    },
    after: after,
    before: before,
    frame: frame
  }

  // private interface
  function listener(request, response) {
    var options, client;
    options = {
      host: request.headers['host'],
      port: request.headers['x-real-port'],
      path: request.url,
      method: request.method,
      maxRedirects: 3
    };
    client = http;
    if (options.port == "443") {
      client = https;
    }

    client.get(options, responseHandler(response)).on("error", requestErrorHandler);
  }

  function responseHandler(response) {
    return function(res) {
      var pageBuffer = "";

      res.setEncoding('utf8');
      res.on('data', function(chunk){
        for (i = 0; i < frameMiddlewares.length; i++) {
          if (response !== undefined) {
            pageBuffer += frameMiddlewares[i].apply(null, [chunk]);
          }
        }
      });

      res.on('end', function() {

        for (i = 0; i < beforeMiddlewares.length; i++) {
          if (response !== undefined) {
            beforeMiddlewares[i].apply(null, [response]);
          }
        }

        response.write(pageBuffer);

        for (i = 0; i < afterMiddlewares.length; i++) {
          if (response !== undefined) {
            afterMiddlewares[i].apply(null, [response]);
          }
        }
        res.on('error', processErrorHandler);

        response.end()
      });
    }
  }

  function after(middleware) {
    afterMiddlewares.push(middleware);
    return this;
  };

  function before(middleware) {
    beforeMiddlewares.push(middleware);
    return this;
  };

  function frame(middleware) {
    frameMiddlewares.push(middleware);
    return this;
  };

  function processErrorHandler(error, response, body){
    util.puts("** process error **".red);
    if (error) { util.puts(error.red); }
    if (body) { util.puts(body.red); }
  };

  function requestErrorHandler(error) {
    util.puts("** request error **".red);
    if(error) { util.puts(error.red); }
  };


  return publicInterface;
}());

exports.Mitm = Mitm;