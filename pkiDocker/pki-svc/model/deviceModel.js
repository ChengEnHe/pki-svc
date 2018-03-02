const Sequelize = require('sequelize')
const sequelize = require('../utils/db')
// create model
var Device = sequelize.define('device', {
  deviceId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  device_mac: {
    type: Sequelize.STRING
  },
  device_name: {
    type: Sequelize.STRING
  },
  device_status: {
    type: Sequelize.INTEGER
  },
  device_type: {
    type: Sequelize.STRING
  },
  device_IoT_org: {
    type: Sequelize.STRING
  },
  device_IoT_type: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true,
  tableName: 'api_device_info',
  timestamps: false // timestamps will now be false
}
)
// add Device
exports.addDevice = function (mac, type, org, wType, uid) {
  // insert device
  return Device.create({
    device_mac: mac,
    device_name: mac,
    device_status: 0,
    device_type: type,
    device_IoT_org: org,
    device_IoT_type: wType,
    createTime: 'current_time()',
    createUser: uid
  })
}
// use mac to find device
exports.findByMac = function (d) {
  console.log('findByMac d:' + d)
  return Device.findAll({
    where: {
      device_mac: d,
      device_status: 0
    }
  })
}
