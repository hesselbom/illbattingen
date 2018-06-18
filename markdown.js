const md = require('markdown-it')({
  linkify: true,
  typographer: true,
  breaks: true
})

md
  .use(require('markdown-it-toc'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-ins'))
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-checkbox'))

md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
  var token = tokens[idx]
  token.attrPush([ 'class', 'table table-striped table-bordered' ])

  return self.renderToken(tokens, idx, options)
}

module.exports = (text) => md.render(text)
