const EventEmitter = require('events')
const Lifx = require('node-lifx-lan')

class LifxController extends EventEmitter {
  constructor({ pollFrequency }) {
    super()
    this.options = { pollFrequency: pollFrequency }
    this.devices = []
    this.discover()
  }

  async discover() {
    this.devices = await Lifx.discover()
    this.emit('ready')
    return this.devices
  }

  getStates() {
    return new Promise(async (res, rej) => {
      if (!this.devices) {
        return null
      }
      let max = this.devices.length
      let i = 0
      this.devices.forEach(async (device) => {
        device.lightState = await device.getLightState()
        i++
        if (i == max) {
          res(this.devices)
        }
      })

    })
  }

  getLight(name) {
    let retdevice = null
    this.devices.forEach((device) => {
      if (device.deviceInfo.label === name) {
        retdevice = device
      }
    })
    return retdevice
  }

  toggleLight(name) {
    return new Promise(async (res, rej) => {
      let light = this.getLight(name)
      light.lightState = await light.getLightState()
      light.lightState.power === 1 ? light.turnOff() : light.turnOn()
      light.lightState = await light.getLightState()
      res(light)
    })
  }
}

module.exports = {
  LifxController: LifxController
}
