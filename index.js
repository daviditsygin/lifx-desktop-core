const lifx = require('./lifx')
const express = require('express')
const app = express()
const port = 3000

let state = 'NOT_READY'

const lifxController = new lifx.LifxController({
  pollTime: 3000
})

function stateHandler(req, res, next) {
  if (state !== 'READY') {
    res.status(500)
    res.send('Not ready')
    return
  }
  next()
}

app.use(stateHandler)

app.get('/', async (req, res) => res.send(await lifxController.getStates()))
app.get('/light/:name', (req, res) => res.send(lifxController.getLight(req.params.name)))
app.get('/light/:name/toggle', async (req, res) => res.send(await lifxController.toggleLight(req.params.name)))

// TODO: groups

//todo add groups

app.listen(port, () => console.log(`Started express on port ${port}`))

lifxController.on('ready', async () => {
  state = 'READY'
  await lifxController.getStates()
  const devices = lifxController.devices
  devices.forEach((device) => {
    console.log(device.lightState)
  })
})
