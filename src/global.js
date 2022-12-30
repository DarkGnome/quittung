import setupLogging from './logging.js'

const log = setupLogging('global', 6)

/** Sets global variables. */
export default async function initGlobal (config) {
  // set logging level
  if (config.logging) {
    global.logging = config.logging
  }
  global.developerMode = process.env.NODE_ENV !== 'production'
  global.taxes = config.taxes

  log('initialized global variables')
}
