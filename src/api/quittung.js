const express = require('express')
const log = require('../logging.js')('api/quittung')
const n2words = require('n2words')

// globally available variables
var Quittung

function createQuittung (req, res) {
  const r = req.body

  log.stringify(r)

  // check input for correctness
  if (!checkRequest(r)) {
    log('Not fulfilling request with incorrect provided values.')
    log.stringify(r)
    // TODO send to error page
    res.redirect('back')
    return
  }

  // who
  const whoTo = r.who_to === 'to_us'
    ? r.who_to_const_text[0] : r.who_to_var_text
  const whoFrom = r.who_from === 'from_us'
    ? r.who_from_const_text[0] : r.who_from_var_text

  // reason
  const reason = getReasonText(r.reason, r.reason_const_text, r.reason_var_text)

  // numbers
  const amount = parseFloat(r.amount).toFixed(2)
  const taxes = lookupTaxes(r.reason)
  const net = (amount / (1.0 + taxes * 0.01)).toFixed(2)
  const inWords = numberToWords(amount)

  // get current date
  const date = getCurrentDate()

  // TODO create pdf
  // TODO sent pdf to download
  log('CREATE: who_to: ' + whoTo +
      ' who_from: ' + whoFrom +
      ' reason: ' + r.reason +
      ' reason_text: ' + reason +
      ' amount: ' + amount +
      ' taxes: ' + taxes +
      ' net: ' + net +
      ' when: ' + date)

  // TODO start print pdf and print job

  // TODO create quittung number
  const quittungNumber = '1337'

  Quittung.create({
    who_to: whoTo,
    who_from: whoFrom,
    reason: r.reason,
    reason_text: reason,
    amount: amount,
    net: net,
    taxes: taxes,
    when: date
  })
  .then(res.render('print_quittung', {
    quittung_number: quittungNumber,
    amount: amount,
    taxes: taxes,
    net: net,
    amount_in_words: inWords,
    who_from: whoFrom,
    who_to: whoTo,
    reason: reason,
    date: date
  }))
}

function checkRequest (r) {
  const needed = ['who_to', 'who_from', 'reason', 'reason_var_text', 'amount']

  const hasAllFields = needed.map(p => r[p] !== undefined).reduce((x, y) => x && y)

  // check who values
  const isCombination1 = r.who_to === 'to_us' && r.who_from === 'from_them'
  const isCombination2 = r.who_to === 'to_them' && r.who_from === 'from_us'
  const whoIsOK = isCombination1 || isCombination2

  // check reason
  const reason = r.reason
  const isValidReason = global.taxes[reason] !== undefined
  // TODO make frontend not pass arrays anymore, then enable these
  // const isDefault = reason === 'default_geben' || reason === 'default_nehmen'
  // const hasReasonConstText = r.reason_const_text !== undefined
  // const eitherDefaultOrConstText = isDefault !== hasReasonConstText
  const eitherDefaultOrConstText = true
  const reasonIsOK = isValidReason && eitherDefaultOrConstText

  // check amount
  const amount = parseFloat(r.amount)
  const amountInOKRange = !isNaN(amount) && amount >= 2 && amount <= 250

  // TODO check nothing is an array

  return hasAllFields && whoIsOK && reasonIsOK && amountInOKRange
}

function getReasonText (reason, constText, varText) {
  const orderedReasons = [
    'miete', 'kaution', 'ersatz', 'verkauf', 'default_nehmen', 'beleg',
    'fahrtkosten', 'gage', 'default_geben']
  const reasonPosition = orderedReasons.indexOf(reason)
  return constText[reasonPosition] + ' ' + varText[reasonPosition]
}

function lookupTaxes (reason) {
  const taxes = global.taxes[reason]
  return taxes
}

function numberToWords (number) {
  const parts = String(number).split('.')
  const integerPart = parts[0]
  const floatPart = parts[1]
  let string = n2words(integerPart, { lang: 'de' }) + ' Euro'
  if (floatPart !== 0) {
    string = string + ' und ' + n2words(floatPart, { lang: 'de' }) + ' Cent'
  }
  return '--- ' + string + ' ---'
}

function getCurrentDate() {
  const day = new Date().toISOString().slice(8, 10)
  const month = new Date().toISOString().slice(5, 7)
  const year = new Date().toISOString().slice(0, 4)
  return day + '.' + month + '.' + year
}
module.exports = function (config, db) {
  var router = express.Router()
  Quittung = db.models.Quittung

  router.post('/', createQuittung)

  return router
}
