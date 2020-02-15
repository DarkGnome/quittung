const fs = require('fs')
const log = require('./logging.js')('db', 6)
const path = require('path')
const Sequelize = require('sequelize')

/** Connect to DB. Returns Promise. */
async function connect (db) {
  try {
    log('connecting to db')
    await db.authenticate()
  } catch (err) {
    log.error('Unable to connect to the database: ', err)
    // TODO throw
  }
}

/** Load models. Asynchronous. */
async function loadModels (db) {
  try {
    log('loading models')
    const folder = path.join(__dirname, 'models')
    let models = {}
    models = await loadModelsRecursive(folder, db, models)
    return models
  } catch (err) {
    log.error('An error occurred while loading the models:', err)
    // TODO throw
  }
}

/** Loads models recursively from given @param folder and adds them to the
  * @param db. Also stores the model names in @param models structure. */
async function loadModelsRecursive (folder, db, models) {
  log.indent()
  for (const file of fs.readdirSync(folder)) {
    const currentFile = path.join(folder, file)

    if (fs.lstatSync(currentFile).isDirectory()) {
      log('entering ' + file)
      models = loadModelsRecursive(currentFile, db, models)
    } else if (file.endsWith('.js')) {
      log('loading  ' + file)
      var model = await db.import(currentFile)
      models[model.name] = model
    } // else ignore
  }
  log.undent()

  return models
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
async function init (conf) {
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

  await connect(db)
  var models = await loadModels(db)
  createAssociations(models)
  await syncSchemes(db)
  await createDefaultValues(models, conf)

  log.info('db ready')
  return db
}

module.exports = init
