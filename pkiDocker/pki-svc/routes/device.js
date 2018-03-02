
const express = require('express')
const router = express.Router()
const device = require('../model/deviceModel')
const CryptoJS = require('crypto-js')
const env = process.env

/* GET device token. 
router.get('/cert', clientAuthentication, function (req, res, next) {
  if (req.checkD) {
    device.findByMac(req.body.d).then(d => {
      console.log(d.get('deviceId'))
    })
    let jsonObj = {responseCode: '000', responseMsg: 'verify success'}
    res.end(JSON.stringify(jsonObj))
  } else {
    let jsonObj = {responseCode: '403', responseMsg: 'verify fail'}
    res.end(JSON.stringify(jsonObj))
  }
})
*/

/* GET device token. */
router.post('/cert', clientAuthentication, getDeviceInfo, function (req, res, next) {
  res.end(JSON.stringify(req.payload))
})

/* Client Authentication Middle function */
function clientAuthentication (req, res, next) {
  req.checkD = false
  console.log('authorized:' + req.client.authorized)
  console.log('d:' + req.body.d)
  console.log('CERT_HAS_EXPIRED:' + req.client.authorizationError)
  if (req.client.authorized || req.client.authorizationError === 'CERT_HAS_EXPIRED') {
    let subject = req.connection.getPeerCertificate().subject
    console.log('UID:' + subject.UID)
    console.log('CN:' + subject.CN)
    if (subject.UID && subject.CN) {
      req.device = {deviceId: subject.UID}
      if (subject.CN) {
        req.device['type'] = subject.CN
      }
      if (req.body.d && req.body.d.length > 0) {
        if (subject.UID === req.body.d) {
          req.checkD = true
        }
      }
    }
  } else {
    if (req.connection.getPeerCertificate().subject) {
      console.log('client certificate: unauthorized ' + JSON.stringify(req.connection.getPeerCertificate()))
    }
  }
  next()
}
/* Get device info function */
function getDeviceInfo (req, res, next) {
  if (req.checkD) {
    device.findByMac(req.body.d).then(d => {
      let obj = {}
      let result = d.map((r) => (r.toJSON()))
      console.log(JSON.stringify(d))
      if (result && result.length > 0) {
        let cpId = 'Gemtek'
        let roleId = 'device'
        let d = new Date()
        let nowSeconds = Math.round(d.getTime() / 1000)
        let payload = result[0].device_mac + ':' + nowSeconds + ':' + result[0].deviceId + ':' + cpId + ':' + roleId
        let ciphertext = CryptoJS.TripleDES.encrypt(payload, env.SECRET_KEY)
        obj['msg'] = 'get success'
        obj['code'] = '000'
        obj['token'] = ciphertext.toString()
        obj['d'] = result[0].device_mac
      } else {
        obj['msg'] = 'no device info'
        obj['code'] = '404'
        obj['d'] = result[0].device_mac
      }
      req.payload = obj
      console.log(JSON.stringify(req.payload))
      next()
    })
  } else {
    let obj = {}
    obj['msg'] = 'verify fail'
    obj['code'] = '403'
    obj['d'] = req.body.d
    req.payload = obj
    console.log(JSON.stringify(obj))
    next()
  }
}

module.exports = router
