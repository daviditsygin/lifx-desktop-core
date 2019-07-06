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

  async getStates() {
    const promises = []
    if (!this.devices) {
      return null
    }
    this.devices.forEach((device) => {
      promises.push(device.getLightState().then((lightState) => {
        device.lightState = lightState
      }))
    })
    await Promise.all(promises).then(() => {
      console.log('promise finished')
    })
    return this.devices
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

  async toggleLight(name) {
    const light = this.getLight(name)
    light.lightState = await light.getLightState()
    light.lightState.power === 1 ? light.turnOff() : light.turnOn()
    return light
  }
}

module.exports = {
  LifxController: LifxController
}
