# Example scenarios for Barracks V2

## Prerequisites

* NodeJS
* An account on [Barracks](https://app.barracks.io)

## Setup

```
$ ./init-data
```

That script will install the barracks cli, setup the script that will be used to emulate the devices, and prepare data on your account.

It will create three filters :

* ```windows``` that retrieve all devices that send ```{ "os": "windows" }``` in the custom client data, that indicate that the device is running with windows
* ```linux``` that retrieve all devices that send ```{ "os": "linux" }``` in the custom client data, that indicate that the device is running with linux
* ```send_logs``` that retrieve all devices that send the ```{ "state": { "sendLogs": true } }``` object in the custom client data, that indicate that the device can send logs to the third party applications.

Also, some packages will be created as follow:

* io.barracks.firmware.windows (require the device to run on windows)
  * v1, a package that determines for a device on windows if the user has to pay or not
* io.barracks.firmware.linux (require the device to run on linux)
  * v1, a package that determines for a device on linux if the user has to pay or not
* io.barracks.firmware.logs (require the device to be on linux and to be able to send logs)
  * v1, a package that determines if the device can send logs to third party apps.

You can check the file describing the deployment plan to see how we built those permissions :

* ```packages/windows_firmware_plan.json```
* ```packages/linux_firmware_plan.json```
* ```packages/send_logs_firmware_plan.json```

## Messaging

### Set a billing status 

All emulated device will listen for messages.
Devices will be able to change their billing status between free and paying. 
To do so, send a message with the following payload : 
```
{
  "io.barracks.firmware.system": {
    "billing": "billing_state" 
  }
}
```
Where ```system``` should be replaced by ```windows``` or ```linux``` depending on the os of the device, and ```billing_state``` can be replaced either by ```free``` or ```paying```.
Other messages will only update the custom data sent by the device to Barracks.

### Allow the devices to send logs to the analytics applications.

Linux devices will be able to send logs to the analytics applications (like Google Analytics or BigQuery). To do so, first you have to set your analytics and bigquery identifiers in your Barracks account.
The logs that will be sent are retrieved from a file located in the same folder as your start scripts and their custom client data. If you add or remove a line from this file, the data sent to bigQuery will be updated.


## Emulate a device

Get your api key from the [account page](https://app.barracks.io/account) of Barracks web application.
Then you can use it to run the device you want as explained further. 

### Note about the devices
You can change the ```customClientData``` sent to Barracks by the device anytime during the emulation by updating the file ```devices/device{DEVICE_NUMBER}_customClientData.json```.
That way you can change the composition of the device on the fly, and see that it will install or uninstall the packages after contacting Barracks.


### Docker image
A docker image exists to easily run everything.
To initialize your data, use the following command:
```
docker run -ti --rm barracksiot/parking-demo init-data
```

To start the windows device:
```
docker run -ti --name windows-device --rm barracksiot/parking-demo start-windows-device <API_KEY>
```

To start the linux device:
```
docker run -ti --name linux-device --rm barracksiot/parking-demo start-linux-device <API_KEY>
```

To send a message to a device:
```
docker run -ti --rm barracksiot/parking-demo send-message <UNIT_ID> '{"io.barracks.firmware.windows":{"billing":"free"}}'
```
