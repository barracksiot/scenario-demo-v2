# Example scenarios for Barracks V2

## Prerequisites

* NodeJS
* An account on [Barracks](https://app.barracks.io)

## Setup

```
$ ./init-data
```

That script will install the barracks cli, setup the script that will be used to emulate the devices, and prepare data on your account.

It will create four filters :

* ```all``` that retrieve all devices
* ```screen``` that retrieve all devices that send the ```{ "hardware": { "screen": "screenRef" } }``` object in the custom client data, that indicate that the device has a screen
* ```speed-sensor``` that retrieve all devices that send the ```{ "hardware": { "speed-sensor": "sensorRef" } }``` object in the custom client data, that indicate that the device has a speed sensor
* ```trafic-counter``` that retrieve all devices that send the ```{ "hardware": { "trafic-counter": "counterRef" } }``` object in the custom client data, that indicate that the device has a trafic counter

Also, some packages will be created as follow:

* io.barracks.firmware.screen (require the device to have a screen)
  * v1, a package that display text on the device's screen
* io.barracks.firmware.speed-sensor (require the device to have a speed sensor)
  * v1, a package that send speed statistics to barracks
* io.barracks.firmware.trafic-counter (require the device to have a counter)
  * v1, a package that send trafic statistics to barracks
* io.barracks.firmware.jam-detector (require the device to have both a counter and a speed sensor)
  * v1, a package that send trafic status to barracks


You can check the file describing the deployment plan to see how we built those permissions :

* ```packages/screen_firmware_plan.json```
* ```packages/speed_sensor_firmware_plan.json```
* ```packages/trafic_counter_firmware_plan.json```
* ```packages/jam_detector_firmware_plan.json```

## Messaging
All emulated device will listent for messages.
Device having the screen hardware will be able to change the displayed text on message receving.
To do so, send a message with the following payload :
```
{
  "io.barracks.firmware.screen": {
    "text": "<Text to be displayed by the device>" 
  }
}
```
Other messages will only update the custom data sent by the device to Barracks.


## Emulate a device

Get your api key from the [account page](https://app.barracks.io/account) of Barracks web application.

Then, move to the ```devices/``` folder, and start a device to emulate

* ```$ ./start-device-1 <YOUR_API_KEY>```
  * By default, is's a device that only has a screen on it.

### Note about the devices
You can change the ```customClientData``` sent to Barracks by the device anytime during the emulation by updating the file ```devices/device{DEVICE_NUMBER}_customClientData.json```.
That way you can change the hardware composition of the device on the fly, and see taht it will install or uninstall the packages after contacing Barracks according to the hardware on it.

Supported hardware values are :

* ```screen```
* ```speed-sensor```
* ```trafic-counter```

Or any combinaison of the three
example:
```
{
  "hardware": {
    "screen": "LCM1602C",
    "speed-sensor": "ETSE8765"
  }
}
```

### Docker image
A docker image exists to easily run everything.
To initialize your data, use the following command:
```
docker run -ti barracksiot/roadways-demo init-data
```

To start the sensor device:
```
docker run -ti --name sensor-device --rm barracksiot/roadways-demo start-sensor-device <API_KEY>
```

To start the display device:
```
docker run -ti --name display-device --rm barracksiot/roadways-demo start-display-device <API_KEY>
```

To send a message to a device:
```
docker run -ti --rm barracksiot/roadways-demo send-message <UNIT_ID> '{"io.barracks.firmware.screen":{"text":"Message to print on screen"}}'
```