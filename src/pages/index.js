var express = require('express')

function getQuittungForm (req, res) {
  res.render('add_quittung', {
    title: 'Quittung'
  })
}

module.exports = function (config, db) {
  var router = express.Router()

  router.get('/', getQuittungForm)

  return router
}
