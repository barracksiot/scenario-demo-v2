# Example scenarios for Barracks V2

## Prerequisites

* NodeJS
* An account on [Barracks](https://app.barracks.io)

## Setup

```
$ ./init-data
```

That script will isntall the barracks cli, setup the script that will be used to emulate the devices, and prepare data on your account.

It will create four filters :

* ```all``` that retrieve all devices
* ```beta``` that retrieve all devices that send the ```{ "type": "beta" }``` object in the custom client data
* ```alpha``` that retrieve all devices that send the ```{ "type": "alpha" }``` object in the custom client data
* ```app2Enabled``` that retrieve all devices that send the t```{ "extra" : { "app2": true }``` object in the custom client data

Also, two packages will be created, with some versions, as follow:

* App1 (available to all devices)
  * v1 (available to all devices)
  * v2 (available to all 'beta' devices)
  * v3 (available to all 'alpha' devices)
* App2 (available only to devices that have the custom client data extra.app2 setted to true)
  * v1 (available to all 'beta' devices)
  * v2 (available to all 'alpha' devices)

You can check the file describing the deployment plan to see how we built those permissions :

* ```packages/app1-plan.json```
* ```packages/app2-plan.json```

## Emulate a device

Get your api key from the [account page](https://app.barracks.io/account) of Barracks web application.

Then, start one of the tree prepared file to emulate a device :

* ```$ ./emulate-device1 <YOUR_API_KEY>```
* ```$ ./emulate-device2 <YOUR_API_KEY>```
* ```$ ./emulate-device3 <YOUR_API_KEY>```

### Device 1
That device initially contact Barracks with no package installed, and no custom client data.

### Device 2
That device initially contact Barracks with App 1 v1 installed, and the beta flag in the custom client data.

### Device 3
That device initially contact Barracks with no package installed, and with the alpha and app2 flag in the custom client data.

