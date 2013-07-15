var util = require('util'),
    colors = require('colors'),
    http = require('follow-redirects').http,
    https = require('follow-redirects').https;


var Mitm = (function() {
  var beforeMiddlewares = [],
      chunkMiddlewares = [],
      afterMiddlewares = [];

  publicInterface = {
    // public interface
    start: function(port) {
      http.createServer(listener).listen(port);
      util.puts('mitm server '.blue + 'started '.green.bold + 'on port '.blue + port.toString().yellow);
    },
    after: after,
    before: before,
    frame: frame
  }

  // private
  function listener(request, response) {
    var options = {
      host: request.headers['host'],
      port: request.headers['x-real-port'],
      path: request.url,
      method: request.method,
      maxRedirects: 3
    };

    var client = http;

    if (options.port == "443") {
      client = https;
    }

    client.get(options, responseHandler(response)).on("error", requestErrorHandler);
  }

  function responseHandler (response) {
    var responseWriter = response;
    return function(res) {
      var pageBuffer = "";

      res.setEncoding('utf8');
      res.on('data', function(chunk){
        for (i = 0; i < chunkMiddlewares.length; i++) {
          if (responseWriter !== undefined) {
            pageBuffer += chunkMiddlewares[i].apply(null, [chunk]);
          }
        }
      });

      res.on('end', function() {

        for (i = 0; i < beforeMiddlewares.length; i++) {
          if (responseWriter !== undefined) {
            beforeMiddlewares[i].apply(null, [responseWriter]);
          }
        }

        responseWriter.write(pageBuffer);

        for (i = 0; i < afterMiddlewares.length; i++) {
          if (responseWriter !== undefined) {
            afterMiddlewares[i].apply(null, [responseWriter]);
          }
        }
        res.on('error', processErrorHandler);

        responseWriter.end()
      });
    }
  }

  function processErrorHandler(error, response, body){
    util.puts("** process error **".red);
    if (error) { util.puts(error.red); }
    if (body) { util.puts(body.red); }
  };

  function requestErrorHandler(error) {
    util.puts("** request error **".red);
    if(error) { util.puts(error.red); }
  };

  function after (middleware) {
    afterMiddlewares.push(middleware);
    return this;
  };

  function before (middleware) {
    beforeMiddlewares.push(middleware);
    return this;
  };

  function frame (middleware) {
    chunkMiddlewares.push(middleware);
    return this;
  };

  return publicInterface;
}());

exports.Mitm = Mitm;