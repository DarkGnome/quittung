import Hjson from 'hjson'
import * as fs from 'fs';
import path from 'node:path'

import setupLogging from './logging.js'

const log = setupLogging('config', 6)

/** Reads config in given @param file. (readability wrapper) */
function readConfig (file) {
  const config_text = fs.readFileSync(file, 'utf8');
  return Hjson.parse(config_text);
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
  const file = path.join(configPath, 'index.hjson')
  const config_text = fs.readFileSync(file, 'utf8')
  const tmpConfig = Hjson.parse(config_text)
  log.setLevel(tmpConfig.logging)
}

/** Initiates loading of config files from  */
export default function loadConfig (folder) {
  var configPath = path.resolve(folder)
  setLogging(configPath)
  log('loading ' + configPath)
  const config = readConfigsRecursive(configPath)
  log.info('loaded config')
  return config
}
