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
* ```screen``` that retrieve all devices that send the ```{ "hardware": { "screen": "screenRef" } }``` object in the custom client data, taht indicate that the device has a screen

Also, some packages will be created as follow:

* io.barracks.firmware.screen
  * v1, a package that display text on the device's screen

You can check the file describing the deployment plan to see how we built those permissions :

* ```packages/screen_firmware_plan.json```

## Emulate a device

Get your api key from the [account page](https://app.barracks.io/account) of Barracks web application.

Then, move to the ```devices/``` folder, and start a device to emulate

* ```$ ./start-device-1 <YOUR_API_KEY>```
  * By default, is's a device that only has a screen on it.

### Note about the devices
You can change the ```customClientData``` sent to Barracks by the device anytime during the emulation by updating the file ```devices/device{DEVICE_NUMBER}_customClientData.json```.
That way you can change the hardware composition of the device on the fly, and see taht it will install or uninstall the packages after contacing Barracks according to the hardware on it.