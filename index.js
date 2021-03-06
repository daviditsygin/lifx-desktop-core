const lifx = require('./lifx/lifx')
const express = require('express')
const app = express()
const port = 12962

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

app.get('/lights/', async (req, res) => res.send(await lifxController.getStates()))
app.get('/light/:name', (req, res) => {
  try {
    const result = lifxController.getLight(req.params.name)
    res.send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})
app.get('/light/:name/toggle', async (req, res) => {
  try {
    const result = await lifxController.toggleLight(req.params.name)
    res.send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})
app.get('/light/:name/on', async (req, res) => {
  try {
    const result = await lifxController.lightOn(req.params.name)
    res.send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})
app.get('/light/:name/off', async (req, res) => {
  try {
    const result = await lifxController.lightOff(req.params.name)
    res.send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})
app.get('/light/:name/color/:color/:duration?', async (req, res) => {
  try {
    // duration is an optional URL param
    if (req.params.color === 'random') {
      req.params.color = Math.floor(Math.random() * 16777215).toString(16)
    }
    const result = await lifxController.setColor(req.params.name, req.params.color, req.params.duration)
    res.send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})
app.get('/group/:name', (req, res) => {
  try {
    const result = lifxController.getGroup(req.params.name)
    res.send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})
app.get('/group/:name/toggle', async (req, res) => {
  try {
    const result = await lifxController.toggleGroup(req.params.name)
    res.send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})
app.get('/group/:name/on', async (req, res) => {
  try {
    const result = await lifxController.groupOn(req.params.name)
    res.send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})
app.get('/group/:name/off', async (req, res) => {
  try {
    const result = await lifxController.groupOff(req.params.name)
    res.send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})
app.get('/group/:name/color/:color/:duration?', async (req, res) => {
  try {
    // duration is an optional URL param
    if (req.params.color === 'random') {
      req.params.color = Math.floor(Math.random() * 16777215).toString(16)
    }
    const result = await lifxController.setGroupColor(req.params.name, req.params.color, req.params.duration)
    res.send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})

app.listen(port, () => console.log(`Started express on port ${port}`))

lifxController.on('ready', async () => {
  state = 'READY'
  await lifxController.getStates()
  const devices = lifxController.devices
  devices.forEach((device) => {
    console.log(device.lightState)
  })
})
