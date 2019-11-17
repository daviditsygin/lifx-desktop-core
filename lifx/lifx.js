/* eslint-disable no-async-promise-executor */
const EventEmitter = require('events')
const Lifx = require('node-lifx-lan')

class LifxController extends EventEmitter {
  constructor({ pollFrequency }) {
    super()
    this.options = { pollFrequency: pollFrequency }
    this.devices = []
    this.devicesByName = {}
    this.groups = {}
    this.discover()
  }

  async discover() {
    this.devices = await Lifx.discover()
    this.devices.forEach((device) => {
      this.devicesByName[device.deviceInfo.label] = device
      if (device.deviceInfo.group && device.deviceInfo.group.label) {
        const groupLabel = device.deviceInfo.group.label
        if (this.groups[groupLabel] === undefined) {
          this.groups[groupLabel] = []
        }
        this.groups[groupLabel].push(device.deviceInfo.label)
      }
    })
    this.emit('ready')
    return this.devices
  }

  getStates() {
    return new Promise(async (resolve, reject) => {
      if (!this.devices) {
        return null
      }
      const max = this.devices.length
      let i = 0
      this.devices.forEach(async (device) => {
        device.lightState = await device.getLightState()
        i++
        if (i === max) {
          resolve(this.devices)
        }
      })
    })
  }

  getLight(name) {
    if (this.devicesByName[name] === undefined) {
      throw new Error('Light not found')
    }
    return this.devicesByName[name]
  }

  toggleLight(name) {
    return new Promise(async (resolve, reject) => {
      try {
        const light = this.getLight(name)
        light.lightState = await light.getLightState()
        light.lightState.power === 1 ? light.turnOff() : light.turnOn()
        light.lightState = await light.getLightState()
        resolve(light)
      } catch (err) {
        reject(err)
      }
    })
  }

  lightOn(name) {
    return new Promise(async (resolve, reject) => {
      try {
        const light = this.getLight(name)
        light.turnOn()
        light.lightState = await light.getLightState()
        resolve(light)
      } catch (err) {
        reject(err)
      }
    })
  }

  lightOff(name) {
    return new Promise(async (resolve, reject) => {
      try {
        const light = this.getLight(name)
        light.turnOff()
        light.lightState = await light.getLightState()
        resolve(light)
      } catch (err) {
        reject(err)
      }
    })
  }

  getGroup(name) {
    if (this.groups[name] === undefined) {
      throw new Error('Group not found')
    }
    const arr = []
    this.groups[name].forEach((deviceName) => {
      arr.push(this.getLight(deviceName))
    })
    return arr
  }

  toggleGroup(name) {
    return new Promise(async (resolve, reject) => {
      if (this.groups[name] === undefined) {
        throw new Error('Group not found')
      }
      const arr = []
      this.groups[name].forEach((deviceName) => {
        arr.push(this.toggleLight(deviceName))
      })
      const res = await Promise.all(arr)
      resolve(res)
    })
  }
}

module.exports = {
  LifxController: LifxController
}
