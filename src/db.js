import * as fs from 'fs';
import path from 'node:path';
import Sequelize from 'sequelize'
import { fileURLToPath } from 'node:url';

import quittungModel from './models/Quittung.js'
import setupLogging from './logging.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const log = setupLogging('db', 6)

/** Connect to DB. Returns Promise. */
async function connect (db) {
  try {
    log('connecting to db')
    return db.authenticate()
  } catch (err) {
    return Promise.reject('Unable to connect to the database: ' + err)
  }
}

/** Load models. Asynchronous. */
async function loadModels (db) {
  return {
    Quittung: quittungModel(db, Sequelize.DataTypes),
  }
}

/** Creates associations for @param models. */
function createAssociations (models) {
  log('loading associations')
  log.indent()
  for (const modelName of Object.keys(models)) {
    if ('associate' in models[modelName]) {
      log('loading for ' + modelName)
      models[modelName].associate(models)
    }
  }
  log.undent()
}

/** Create/Sync default values with models. Asynchronous. */
async function createDefaultValues (models, conf) {
  if (!conf.defaults) {
    log.warn('no defaults for any model defined!')
  } else {
    log('loading default values')
    log.indent()
    for (var modelName in conf.defaults) {
      log('loading default values of ' + modelName)
      const model = conf.defaults[modelName]
      for (var defaultValue of model.values) {
        const wrapped = {}
        wrapped.where = defaultValue
        await models[modelName].findOrCreate(wrapped)
      }
    }
    log.undent()
  }
}

/** Sync models. Asynchronous. */
async function syncSchemes (sequelize) {
  try {
    log('syncing models')
    await sequelize.sync({ force: true }) // {force:true} //force deletes existing entries
  } catch (err) {
    log.error('Could not synchronize database: ' + err)
    // TODO throw
  };
}

/** Init function of the db. Returns Promise.
 * -establish connection
 * -load models
 * -load associations
 * -[opt if creating a new db] db initialization with default values
 * -sync models
 */
export default async function initDB (conf) {
  let uri
  try {
    uri = conf.db.uri
    log('using: ' + uri)
  } catch (err) {
    log.warn("no URI specified, defaulting to 'sqlite:db.sqlite'")
    uri = 'uri: sqlite:db.sqlite'
  }
  const db = new Sequelize(uri, {
    logging: conf.db.logging ? log : false
  })

  var models

  return connect(db)
    .then(() => {
      models = loadModels(db)

      createAssociations(models)
      return syncSchemes(db)
    })
    .then(() => {
      createDefaultValues(models, conf);
      log.info('db ready');
      return db;
    })
    .catch(err => {
      log.error(err)
    })
}
