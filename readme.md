# jekyll-preview

Every time I try to setup a local Jekyll server, I fail. So I worked on a
little preview server in node.

For local preview, this is aiming to provide the minimal amount of Jekyll
features to quickly check out a post in the given theme and site configuration,
responding with what would generate Jekyll (or close enough).

- Loads data from `_config.yml`
- Builds `{{ site }}` and `{{ page }}` variables with some stuff that Jekyll
  would generate for Liquid templates to consume.
- Reads yaml front matter in both posts and layouts
- Layout chaining support
- Quick, simple and node

## Install

```
$ npm install --global jekyll-preview
```

**Ex.**

```
$ jekyll-preview ./
jekyll Listening on http://localhost:4567 serving /home/mk/src/mklabs/mklabs.github.com +0ms
jekyll:server Incoming request: / +838ms
jekyll:render Rendering page +1ms /home/mk/src/mklabs/mklabs.github.com/index.html
jekyll:server Incoming request: /_posts/2014-6-7-dockerized-jenkins-and-slaves.md +50s
jekyll:render Rendering _posts/2014-6-7-dockerized-jenkins-and-slaves.md file +0ms
```

## Usage

```
$ jekyll-preview --help

  Usage
    jekyll-preview <dir> [options]

  Options
    --port  Server port [Default: 4567]

  Examples

    $ jekyll-preview

    $ jekyll-preview ./path/to/jekyll_dir
```


## License

MIT © [jekyll-preview](https://github.com/mklabs/jekyll-preview)
