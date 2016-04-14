var fs = require('fs');
var exists = require('fs').existsSync;
var path = require('path');
var yaml = require('js-yaml');
var frontMatter = require('yaml-front-matter').loadFront;
var read = fs.readFileSync;

module.exports = site;

function site(dir) {
  dir = dir || process.cwd();

  var configyml = path.join(dir, '_config.yml');
  var data = exists(configyml) ? yaml.safeLoad(read(configyml, 'utf8')) : {};

  data.time = Date.now();

  data.pages = 'list all pages';

  // TODO: glob instead, lookup for all _posts folders
  data.posts = fs.readdirSync(path.join(dir, '_posts')).map(function (file) {
    var front = frontMatter(read(path.join(dir, '_posts', file), 'utf8'));
    var date = Date.parse(file.replace(/(\d+-\d+-\d+).+/, '$1'));

    return {
      date: file.replace(/(\d+-\d+-\d+).+/, '$1'),
      time: date,
      title: front.title || file,
      url: front.url || '_posts/' + file
    };
  }).sort(function (a, b) {
    return a.time > b.time ? -1 : 1;
  });

  return data;
}
