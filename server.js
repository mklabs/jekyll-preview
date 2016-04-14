var debug = require('debug')('jekyll:server');

var http = require('http');
var finalhandler = require('finalhandler');
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');

var render = require('./render');

module.exports = function createServer(dir, port, done) {
  var index = serveIndex(dir, {icons: true});
  var serve = serveStatic(dir);

  var server = http.createServer(function onRequest(req, res) {
    debug('Incoming request: %s', req.url);

    var serverHandler = finalhandler(req, res);

    req.dir = dir;

    render(req, res, function (err) {
      if (err) return serverHandler(err);
      serve(req, res, function onNext(err) {
        if (err) return serverHandler(err);
        index(req, res, serverHandler);
      });
    });
  });

  // Listen
  server.listen(port, done);

  return server;
};
