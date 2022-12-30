import loadConfig from './config.js'
import initDB from './db.js'
import initGlobal from './global.js'
import setupLogging from './logging.js'
import initRouter from './router.js'
import runServer from './server.js'

const log = setupLogging('main', 6)

/*
 * Starting function. Startup order is:
 * A-config
 *   load recursively from ./config directory
 * B-database
 *   connect and init db with sequelize
 * C-router
 *   set up routing with express and set pug to be used for rendering pages
 * D-global
 *   set up global variables
 * E-server
 *   bind to localhost and start
 */
export default async function start () {
  const config = loadConfig('./config')
  var router
  initGlobal(config)
    .then(() => {
      setMode(config.mode)
      return initDB(config)
    })
    .then(db => {
      return initRouter(config, db)
    })
    .then(r => {
      router = r
      try {
        runServer(config.server, router)
      } catch (err) {
        log.fatal('Server crashed. Error was: ' + err)
        process.exit(1)
      };
    })
    .catch((err) => {
      log.error("Error: " + err)
    })
}

function setMode (mode) {
  if (mode !== 'production') {
    const fence = '#'.repeat(25)
    log.info(fence + ' !!! Running in ' + mode + ' mode !!! ' + fence)
  } else {
    log.info('Running in produciton mode.')
  }
  process.env.NODE_ENV = mode
}
