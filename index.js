const HID = require('node-hid')
const Emittery = require('emittery')

const VENDOR_ID = 2385
const PRODUCT_ID = 5828

// usage pages
// 65472 - power state/muting/unmuting - byte length: 2
// 12 - volume up/down - byte length: 5
// 65363 - "status" - byte length: 20

module.exports = ({ debug = false } = {}) => {
  HID.setDriverType('libusb')
  const emitter = new Emittery()

  const devices = HID.devices().filter(
    (d) => d.vendorId === VENDOR_ID && d.productId === PRODUCT_ID
  )

  if (devices.length === 0) {
    throw new Error(new Error('HyperX Cloud Flight Wireless was not found'))
  }

  let interval
  let bootstrapDevice

  function bootstrap() {
    if (!interval) {
      interval = setInterval(bootstrap, 1 * 1000 * 60) // every 5m
    }

    if (!bootstrapDevice) {
      const bootstrapDeviceInfo = devices.find(
        (d) => d.usagePage === 65363 && d.usage === 771
      )
      bootstrapDevice = new HID.HID(bootstrapDeviceInfo.path)
    }

    try {
      const buffer = Buffer.from([
        0x21,
        0xff,
        0x05,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
      ])
      bootstrapDevice.write(buffer)
    } catch (e) {
      emitter.emit('error', e)
    }
  }

  bootstrap()

  devices.map((deviceInfo) => {
    const device = new HID.HID(deviceInfo.path)

    emitter.on('close', () => device.close())

    device.on('error', (err) => emitter.emit('error', err))
    device.on('data', (data) => {
      if (debug) {
        console.log(new Date(), data, `length: ${data.length}`)

        for (byte of data) {
          console.log(byte)
        }
      }

      switch (data.length) {
        case 0x2:
          if (data[0] === 0x64 && data[1] == 0x3) {
            clearInterval(interval)

            return emitter.emit('power', 'off')
          }

          if (data[0] === 0x64 && data[1] == 0x1) {
            bootstrap()

            return emitter.emit('power', 'on')
          }

          const isMuted = data[0] === 0x65 && data[1] === 0x04
          emitter.emit('muted', isMuted)
          break
        case 0x5:
          const volumeDirectionValue = data[1]
          const volumeDirection =
            volumeDirectionValue === 0x01
              ? 'up'
              : volumeDirectionValue === 0x02
              ? 'down'
              : null

          if (!volumeDirection) {
            return
          }

          emitter.emit('volume', volumeDirection)
          break
        case 0xf:
        case 0x14:
          const chargeState = data[3]
          const magicValue = data[4] || chargeState

          function calculatePercentage() {
            if (chargeState === 0x10) {
              emitter.emit('charging', magicValue >= 20)

              if (magicValue <= 11) {
                return 100
              }
            }

            if (chargeState === 0xf) {
              if (magicValue >= 130) {
                return 100
              }

              if (magicValue < 130 && magicValue >= 120) {
                return 95
              }

              if (magicValue < 120 && magicValue >= 100) {
                return 90
              }

              if (magicValue < 100 && magicValue >= 70) {
                return 85
              }

              if (magicValue < 70 && magicValue >= 50) {
                return 80
              }

              if (magicValue < 50 && magicValue >= 20) {
                return 75
              }

              if (magicValue < 20 && magicValue > 0) {
                return 70
              }
            }

            if (chargeState === 0xe) {
              if (magicValue < 250 && magicValue > 240) {
                return 65
              }

              if (magicValue < 240 && magicValue >= 220) {
                return 60
              }

              if (magicValue < 220 && magicValue >= 208) {
                return 55
              }

              if (magicValue < 208 && magicValue >= 200) {
                return 50
              }

              if (magicValue < 200 && magicValue >= 190) {
                return 45
              }

              if (magicValue < 190 && magicValue >= 180) {
                return 40
              }

              if (magicValue < 179 && magicValue >= 169) {
                return 35
              }

              if (magicValue < 169 && magicValue >= 159) {
                return 30
              }

              if (magicValue < 159 && magicValue >= 148) {
                return 25
              }

              if (magicValue < 148 && magicValue >= 119) {
                return 20
              }

              if (magicValue < 119 && magicValue >= 90) {
                return 15
              }

              if (magicValue < 90) {
                return 10
              }
            }

            return null
          }

          const percentage = calculatePercentage()
          if (percentage) {
            emitter.emit('battery', percentage)
          }
          break
        default:
          emitter.emit('unknown', data)
      }
    })
  })

  return emitter
}
