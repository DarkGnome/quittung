require('hjson/lib/require-config')

const fs = require('fs')
const log = require('./logging.js')('config', 6)
const path = require('path')

/** Reads config in given @param file. (readability wrapper) */
function readConfig (file) {
  var newConfig = require(file)
  return newConfig
}

/** Adds a config @param subConfig to a @param parentConfig by setting it as a property called @param name. */
function addSubConfig (subConfig, parentConfig, name) {
  parentConfig[name] = subConfig
}

/** Recursively reads through @param currentFolder. Merges all config files into one config object which is returned. */
function readConfigsRecursive (currentFolder) {
  var currentConfig = {}

  log.indent()

  fs.readdirSync(currentFolder).forEach(function (filename) {
    var currentFile = path.join(currentFolder, filename)

    if (fs.lstatSync(currentFile).isDirectory()) {
      log('entering   ' + currentFile)
      const subConfig = readConfigsRecursive(currentFile)
      addSubConfig(subConfig, currentConfig, filename)
    } else if (filename.endsWith('.hjson')) {
      log('processing ' + currentFile)
      const subConfig = readConfig(currentFile)
      if (filename.toLowerCase() === 'index.hjson') {
        currentConfig = Object.assign(currentConfig, subConfig)
      } else {
        var extentionless = filename.substring(0, filename.lastIndexOf('.hjson'))
        addSubConfig(subConfig, currentConfig, extentionless)
      }
    } // else ignore
  })

  log.undent()
  return currentConfig
}

/** Load main config file from @param configPath and set logging level. */
function setLogging (configPath) {
  const file = path.join(configPath, 'index')
  const tmpConfig = require(file)
  log.setLevel(tmpConfig.logging)
}

/** Initiates loading of config files from  */
function load (folder) {
  var configPath = path.resolve(folder)
  setLogging(configPath)
  log('loading ' + configPath)
  const config = readConfigsRecursive(configPath)
  log.info('loaded config')
  return config
}

module.exports = load
