const md = require('markdown-it')({
  linkify: true,
  typographer: true,
  breaks: true,
  html: true
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

const extractProps = (str) => {
  let props = {}
  let arr
  let regex = /([^=]*)="([^"]*)"/g
  while (arr = regex.exec(str)) { // eslint-disable-line
    props[arr[1].trim()] = arr[2]
  }
  return props
}

module.exports = (text) => {
  // Fix buttons
  text = text.replace(/\\?\[button([^\]]*)\]/g, (_, p1) => {
    let {text, url} = extractProps(p1)
    return `<a href="${url}" class="text-button">${text}</a>`
  })

  return md.render(text)
    // Fix image paragraphs
    .replace(/<p>(<img[^>]*>)<\/p>/g, (_, p1) => (
      `<p class="image">${p1}</p>`
    ))
}
