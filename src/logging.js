/** Provides some simple logging with a prompt and indentions. */
module.exports = function (_prompt, _promptLength, _indentLength) {
  var log = function (string) {
    log.debug(string)
  }

  /* prompt related */
  let prompt = _prompt || 'log'
  let promptLength = _promptLength || 3
  promptLength = Math.max(prompt.length, promptLength)
  prompt = prompt + String(' ').repeat(promptLength - prompt.length) + ' | '

  /* indenting related */
  const indentLength = _indentLength || 2
  const indentString = String(' ').repeat(indentLength)
  let indention = ''
  log.indent = function () {
    indention += indentString
  }
  log.undent = function () {
    indention = indention.substring(indentLength)
  }
  log.unindent = log.undent

  /* different logging level funcitons */
  function dummy (string) {}

  function debug (string) {
    console.debug('DEBUG | ' + prompt + indention + string)
  }

  function info (string) {
    console.info('INFO  | ' + prompt + indention + string)
  }

  function warn (string) {
    console.warn('WARN  | ' + prompt + string)
  }

  function error (string) {
    console.error('ERROR | ' + prompt + string)
  }

  log.fatal = function (string) {
    console.error('FATAL | ' + prompt + string)
  }

  /* functions to regulate logging level */
  function setAll (fun) {
    log.debug = fun
    log.log = fun
    log.info = fun
    log.warn = fun
    log.error = fun
    // log.fatal is never disabled;
  }

  log.disable = () => setAll(dummy)

  log.setLevel = function (level) {
    log.disable()
    switch (level) {
      case 'debug':
        log.debug = debug
        log.log = debug
        /* FALLTHROUGH */
      default:
      case 'info':
        log.info = info
        /* FALLTHROUGH */
      case 'warn':
        log.warn = warn
        /* FALLTHROUGH */
      case 'error':
        log.error = error
        /* FALLTHROUGH */
      case 'fatal':
      case false:
        break
    }
  }

  function init (string) {
    log.setLevel(global.logging)
    this(string)
  }

  setAll(init)

  return log
}
