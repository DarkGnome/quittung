import bodyParser from 'body-parser';
import express from 'express';
import favicon from 'express-favicon';
import path from 'node:path';

import routeApiCreateQuittung from './api/quittung.js'
import routePageQuittung from './pages/index.js'

import setupLogging from './logging.js'

const log = setupLogging('router', 6)

function create404 (req, res, next) {
  var err = new Error('Not Found.')
  err.status = 404
  next(err)
}

function errorHandler (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    // no stacktraces leaked to user unless in development mode
    error: global.developerMode ? err : {}
  })
}

/** Sets up routing. */
export default function initRouter (config, db) {
  const router = express()

  try {
    // folders
    const staticFolder = path.resolve('./src/static')
    const viewsFolder = path.resolve('./src/views')

    // favicon
    log('setting favicon')
    router.use(favicon(path.join(staticFolder, 'img', 'favicon', 'favicon.png')))

    // view engine setup
    log('setting view engine')
    router.set('views', viewsFolder)
    router.set('view engine', 'pug')

    // body parser
    router.use(bodyParser.json())
    router.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))

    // route
    log('setting up /api')
    router.use("/api/quittung", routeApiCreateQuittung(config, db))

    log('setting up static content')
    router.use('/', express.static(staticFolder))

    log('setting up pages')
    router.use("/", routePageQuittung(config, db))

    log('setting up default 404 fallback')
    router.use(create404)
    log('setting up error handler')
    router.use(errorHandler)
    log.info('routing set up')
  } catch (err) {
    log.error('error occured during routing: ' + err)
  };

  return router
}
