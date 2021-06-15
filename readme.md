# hyperx-cloud-flight-wireless

> Module for interfacing with [HyperX Cloud Flight Wireless](https://www.hyperxgaming.com/unitedstates/us/headsets/cloud-flight-wireless-gaming-headset)

Supports Windows 10 x64 and Linux following the [instructions](https://github.com/srn/hyperx-cloud-flight-wireless#linux-support).

Current functionality:

- Power state
- Microphone state
- Volume state
- Charging state
- Battery percentage

## Install

```sh
$ npm install srn/hyperx-cloud-flight-wireless
```

## Usage

```js
const hyperxCloudFlight = require('hyperx-cloud-flight-wireless')()

hyperxCloudFlight.on('power', state) // 'on' | 'off'
hyperxCloudFlight.on('muted', muted) // Boolean
hyperxCloudFlight.on('volume', direction) // 'up' | 'down'
hyperxCloudFlight.on('charging', charging) // Boolean
hyperxCloudFlight.on('battery', percentage) // 0-100 | null
hyperxCloudFlight.on('error', error) // instanceof Error
```

## Notes

The battery percentage is only an estimate based on the "status" report.

## Linux support

To work with linux it is necessary to run as root, or define rules for udev.

```
echo 'KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0664", GROUP="plugdev"' | sudo tee -a /etc/udev/rules.d/99-hidraw-permissions.rules && sudo udevadm control --reload-rules
```

disconnect and reconnect the device

## License

MIT © [Søren Brokær](https://srn.io)
