const dotEnv = require('dotenv').config({path : __dirname + '/.env'})
const env = process.env
const fs = require('fs')
/* Solve single ca certificate problem */
let ca = []
let chain = fs.readFileSync(__dirname + env.SSL_CA, 'utf8')
chain = chain.split('\n')
let cert = []
for (let _i = 0, _len = chain.length; _i < _len; _i++) {
  let line = chain[_i]
  if (!(line.length !== 0)) {
    continue
  }
  cert.push(line)
  if (line.match(/-END CERTIFICATE-/)) {
    ca.push(cert.join('\n'))
    cert = []
  }
}
var options = {
  key: fs.readFileSync(__dirname + env.SSL_KEY),
  cert: fs.readFileSync(__dirname + env.SSL_CERT),
  ca: ca,
  requestCert: true,
  rejectUnauthorized: false,
}

//ssl object
var ssl = {}

ssl.options = options

module.exports = ssl
