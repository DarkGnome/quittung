const log = require('./logging.js')('global', 6)

/** Sets global variables. */
async function init (config) {
  // set logging level
  if (config.logging) {
    global.logging = config.logging
  }
  global.developerMode = process.env.NODE_ENV !== 'production'
  global.taxes = config.taxes

  log('initialized global variables')
}

module.exports = init
