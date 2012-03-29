#!/usr/bin/env node
//
// Build the web site.
//

var fs = require('fs')
var SP = require('static-plus')

function main() {
  var DB = process.argv[2]
    , DDOC = '_design/facebook'
    , SITE_ROOT = '/' + DB + '/' + DDOC

  if(!DB)
    return console.error('Usage: build.js <database_url>')

  console.log('Pushing: %s', DB)
  var builder = new SP.Builder
  builder.read_only = true
  builder.target = DB + '/' + DDOC

  builder.on('die', function(reason) {
    console.error('Builder died: %j', reason)
  })

  builder.template        = __dirname + '/page.tmpl.html'
  builder.helpers.site    = function(ctx) { return '/' + DB + '/' + DDOC + '/_rewrite' }
  builder.helpers.couchdb = function(ctx) { return '/' + DB + '/' + DDOC + '/_rewrite/_couchdb' }

  // The entire site has only one page, the landing page.
  builder.doc({ '_id'   : ''
              , 'title' : 'Facebook on CouchDB'
              , 'github': 'https://github.com/iriscouch' // TODO
              })

  builder.deploy()
  builder.on('deploy', function(result) {
    console.log('Deployed: %s', result)
  })
}

if(require.main === module)
  main()
