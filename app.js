var server = require('./app/config/server')()

server.listen(server.set('port'))