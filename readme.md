# hyperx-cloud-flight-wireless

> Module for interfacing with [HyperX Cloud Flight Wireless](https://www.hyperxgaming.com/unitedstates/us/headsets/cloud-flight-wireless-gaming-headset)

Supports Windows 10 x64.

Current functionality:

- Power state
- Microphone state
- Volume state
- Charging state
- Battery percentage

## Install

```sh
$ npm i hyperx-cloud-flight-wireless
```

## Usage

```js
const hyperxCloudFlight = require('hyperx-cloud-flight')()

hyperxCloudFlight.on('power', state) // 'on' | 'off'
hyperxCloudFlight.on('muted', muted) // Boolean
hyperxCloudFlight.on('volume', direction) // 'up' | 'down'
hyperxCloudFlight.on('charging', charging) // Boolean
hyperxCloudFlight.on('battery', percentage) // 0-100 | null
hyperxCloudFlight.on('error', error) // instanceof Error
```

## Notes

The battery percentage is only an estimate based on the "status" report.

## License

MIT © [Søren Brokær](https://srn.io)
