const EventEmitter = require('events')
const Lifx = require('node-lifx-lan')

class LifxController extends EventEmitter {
  constructor({ pollFrequency }) {
    super()
    this.options = { pollFrequency: pollFrequency }
    this.devices = []
    this.discover()
    this.interval = setInterval(this.getStates, this.options.pollFrequency)
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
    this.devices.forEach(device => {
      promises.push(device.lightState = device.getLightState())
    })
    await Promise.all(promises).then(() => {
      console.log('promise finished')
    })
    return this.devices
  }
}

module.exports = {
  LifxController: LifxController
}
