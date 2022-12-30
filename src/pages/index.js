import express from 'express'

function getQuittungForm (req, res) {
  res.render('add_quittung', {
    title: 'Quittung'
  })
}

export default function routePageQuittung (config, db) {
  var router = express.Router()

  router.get('/', getQuittungForm)

  return router
}
