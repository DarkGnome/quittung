import express from 'express'
import hjson from 'hjson';
import fs from 'fs';

const config = hjson.parse(fs.readFileSync('config/index.hjson', 'utf8'));
const organizationName = config.organization.name;

function getQuittungForm (req, res) {
  res.render('add_quittung', {
    title: 'Quittung',
    organizationName: organizationName
  })
}

export default function routePageQuittung (config, db) {
  var router = express.Router()

  router.get('/', getQuittungForm)

  return router
}
