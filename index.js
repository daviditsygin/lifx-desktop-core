const lifx = require('./lifx')

const lifxController = new lifx.LifxController({
  pollTime: 3000
})

lifxController.on('ready', async () => {
  const devices = await lifxController.getStates()
  devices.forEach((device) => {
    console.log(device.lightState)
  })
})
