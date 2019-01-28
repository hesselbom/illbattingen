const fs = require('fs')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const globImporter = require('node-sass-glob-importer')
const markdown = require('./helpers/markdown')
const idify = require('./helpers/idify')
const settings = require('./settings.json')

const prod = process.env.NODE_ENV === 'production'

const extractHtml = new ExtractTextPlugin('[name]')
const extractStyle = new ExtractTextPlugin('style.css')

// Find pages
const pages = {}
const templateDir = path.resolve(__dirname, '_data')
const templates = fs.readdirSync(templateDir)
  .filter(f => fs.statSync(path.join(templateDir, f)).isDirectory())

templates.forEach(template => {
  fs.readdirSync(path.resolve(templateDir, template))
    .filter(file => path.extname(file) === '.json')
    .forEach(file => {
      const page = path.basename(file, '.json')
      pages[page] = {
        template,
        data: require(path.resolve(templateDir, template, file))
      }
    })
})

const entries = {}

Object.keys(pages).forEach(key => {
  const data = pages[key]
  let url = data.data.customUrl || key
  if (url.charAt(0) === '/') url = url.substr(1)
  entries[`${url}.html`] = path.resolve(__dirname, 'src', `${data.template}.pug?file=${key}`)
})

module.exports = {
  entry: {
    ...entries,
    'script.js': path.resolve(__dirname, 'src/index.js')
  },
  output: {
    filename: '[name]',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: extractHtml.extract([
          'html-loader',
          {
            loader: 'pug-html-loader',
            options: {
              callback: ({ resourceQuery }) => {
                const [, key] = resourceQuery.match(/\?file=(.*)/)
                const page = pages[key]
                return {
                  data: {
                    markdown,
                    idify,
                    settings,
                    prod,
                    data: page.data
                  }
                }
              }
            }
          }
        ])
      },
      {
        test: /\.css$/,
        loader: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.sass$/,
        loader: extractStyle.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                importer: globImporter(),
                outputStyle: prod ? 'compressed' : 'nested'
              }
            }
          ]
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [].concat(
    extractHtml,
    extractStyle,
    new CopyWebpackPlugin(['static'])
  )
}
