var fs = require('fs');
var path = require('path');

var debug = require('debug')('jekyll:render');
var liquid = new (require('liquid-node').Engine)();
var frontMatter = require('yaml-front-matter').loadFront;
var md = require('markdown-it')();

var site = require('./site')();

var data = Object.assign({}, site, {
  site: site
});

module.exports = function render(req, res, done) {
  var file = req.url.replace(/^\//, '');
  var dir = req.dir || process.cwd();

  function complete(err, content) {
    if (err) return done(err);
    res.end(content);
  }

  if (req.url === '/' || /\.html$/.test(file)) {
    file = file || 'index.html';
    return renderPage(path.resolve(dir, file), complete);
  }

  if (!/_posts/.test(file)) return done();
  if (/_posts\/?$/.test(file)) return done();

  debug('Rendering %s file', file);

  fs.readFile(path.resolve(dir, file), 'utf8', function(err, post) {
    if (err) return done(err);

    var front = frontMatter(post);
    front.file = file;
    front.dir = dir;
    renderPost(front, complete);
  });
};

function renderPage(page, done) {
  debug('Rendering page', page);

  var front = frontMatter(page);
  front.dir = path.dirname(page);
  renderFile(front, done);
}

function renderPost(post, done) {
  debug('Rendering post %s', post.file);

  post.__content = md.render(post.__content);
  renderFile(post, done);
}

function renderFile(front, done) {
  var content = front.__content;

  renderLayout(front, function(err, body) {
    if (err) return done(err);

    var page = Object.assign({}, site, {
      title: front.title || front.file || '',
      url: '/_posts/' + front.file
    });

    var data = Object.assign({}, site, {
      site: site,
      page: page,
      content: content
    });

    liquid.parseAndRender(body, data).then(done.bind(null, null));
  });
}

function renderLayout(front, done) {
  var dir = front.dir || process.cwd();
  var layout = path.join(dir, '_layouts', front.layout + '.html');

  fs.readFile(layout, 'utf8', function(err, body) {
    if (err) return done(err);

    var lfront = frontMatter(body);
    lfront.dir = dir;

    var page = Object.assign({}, site, {
      title: front.title || lfront.file || '',
      url: '/_posts/' + front.file
    });

    var context = Object.assign({}, data, {
      content: front.__content,
      page: page
    });

    liquid.parseAndRender(lfront.__content, context)
      .then(function(result) {
        if (lfront.layout) return renderLayout(lfront, done);
        done(null, result);
      })
      .catch(done);
  });
}
