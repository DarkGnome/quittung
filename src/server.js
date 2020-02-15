const http = require('http')
const ip   = require('ip');
const log = require('./logging.js')('server', 6)

/** Starts the server and binds it to the port. */
function run (conf, router) {
  // Create HTTP server.
  var port = conf.port
  router.set('port', port)
  var server = http.createServer(router)

  log('starting')
  if (conf.bind_method === 'ip') {
    let address = ip.address();
    server.listen(port, address);
  } else if (conf.bind_method === 'localhost') {
    server.listen(port);
  } else {
    log.warn('no bind method defined, falling back to localhost')
    server.listen(port);
  }

  server.on('listening', function onListening () {
    var host = server.address().address
    host = (host === '::') ? 'localhost' : host
    log.info('listening at ' + host + ':' + port)
  })
  server.on('error', function onError (error) {
    if (error.syscall !== 'listen') {
      throw error
    }

    var bind = (typeof port === 'string' ? 'Pipe ' : 'Port ') + port

    // handle specific listen errors
    switch (error.code) {
      case 'EACCES':
        log.fatal(bind + ' requires elevated privileges')
        process.exit(1)
      case 'EADDRINUSE':
        log.fatal(bind + ' is already in use')
        process.exit(1)
      default:
        throw error
    }
  })
}

module.exports = run
