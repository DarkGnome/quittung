const log = require('./logging.js')('main', 6)

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
async function start () {
  var loadConfig = require('./config.js')
  var initDB = require('./db.js')
  var initGlobal = require('./global.js')
  var initRouter = require('./router.js')
  var runServer = require('./server.js')

  const config = loadConfig('./config')
  await initGlobal(config)
  setMode(config.mode)
  const db = await initDB(config)
  const router = await initRouter(config, db)
  try {
    runServer(config.server, router)
  } catch (err) {
    log.fatal('Server crashed. Error was: ', err)
    process.exit(1)
  };
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

module.exports = start
