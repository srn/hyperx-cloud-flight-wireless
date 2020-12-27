const hyperxCloudFlight = require('./')({ debug: true })

hyperxCloudFlight.on('power', (power) => console.log(`power: ${power}`))
hyperxCloudFlight.on('muted', (status) => console.log(`muted: ${status}`))
hyperxCloudFlight.on('volume', (direction) =>
  console.log(`volume: ${direction}`)
)
hyperxCloudFlight.on('charging', (charging) =>
  console.log(`charging: ${charging}`)
)
hyperxCloudFlight.on('battery', (percentage) =>
  console.log(`current battery: ${percentage}%`)
)
hyperxCloudFlight.on('unknown', (data) => console.log('unknown', data))
hyperxCloudFlight.on('error', (error) => console.error('error', error))
