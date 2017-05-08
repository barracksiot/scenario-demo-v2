#!/usr/bin/env node
const Barracks = require('barracks-sdk');

const args = {};
process.argv.forEach(function (val, index) {
  if (index >= 2 && index % 2 === 0) {
    const argName = val.substr(2);
    args[argName] = process.argv[index + 1];
  }
});

const apiKey = args.apiKey;
const unitId = args.unitId;
let customClientData;
let packages;
try {
  packages = JSON.parse(args.packages);
} catch(err) {
  packages = undefined;
}

try {
  customClientData = JSON.parse(args.customClientData);
} catch(err) {
  customClientData = undefined;
}


if (!apiKey || !unitId || !packages) {
  console.log('resolvePackage expect 3 arguments :');
  console.log('--apiKey, <API_KEY>, the api key of the Barracks account');
  console.log('--unitId <UNIT_ID>, the unit id of the device to be emulated');
  console.log('--packages <PACKAGES>, a valid JSON string containing the packages installed on the device');
  process.exit(1);
}

console.log(`Contacting Barracks for device ${unitId}, with packages:`);
console.log(packages);
console.log('');
if (customClientData) {
  console.log('and with custom client data:');
  console.log(customClientData);
  console.log('');
}

const barracks = new Barracks({ apiKey });

barracks.getDevicePackages(unitId, packages, customClientData).then(function (response) {
  console.log('Barracks response :\n');
  if (response.available.length > 0) {
    console.log('New package(s) available(s):');
    console.log(response.available);
    console.log('\n');
  } else {
    console.log('No new package available \n');
  }

  if (response.changed.length > 0) {
    console.log('New version(s) available(s) for installed package(s):');
    console.log(response.changed);
    console.log('');
  } else {
    console.log('No update for installed package(s) \n');
  }

  if (response.unchanged.length > 0) {
    console.log('No change for installed package(s):');
    console.log(response.unchanged);
    console.log('');
  } else {
    console.log('No unchanged package \n');
  }

  if (response.unavailable.length > 0) {
    console.log('Some Package(s) are not available anymore:');
    console.log(response.unavailable);
    console.log('');
  } else {
    console.log('No unavailable package \n');
  }
}).catch(function (err) {
  console.error('Error when checking for a new update: ', err);
});
