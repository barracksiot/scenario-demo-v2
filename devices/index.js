#!/usr/bin/env node
const fs = require('fs');
const Barracks = require('barracks-sdk');

const BarracksMessenger = require('barracks-messenger-sdk-betatest');

const CHECK_INTERVAL = 20000;

const unitId = process.argv[2];
const apiKey = process.argv[3];
const customClientDataPath = process.argv[4];
const packagesFolder = `${unitId}-packages/`;

const barracks = new Barracks({ apiKey, allowSelfSigned:true });
const messenger = new BarracksMessenger.BarracksMessenger({
  unitId: unitId,
  apiKey: apiKey,
  baseUrl: 'https://192.168.99.100',
  mqttEndpoint: 'mqtt://192.168.99.100'
});

let installedPackages = [];
let state = {};

function getCustomClientData(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {

        // TODO remove that part when BO-1455 will be online
        const fixedState = {};
        Object.keys(state).forEach(key => {
          fixedState[key.split('.').join('_')] = state[key];
        });

        resolve(Object.assign(
          {},
          JSON.parse(data),
          { state: fixedState }
        ));
      }
    });
  });
};

function uninstallPackage(package) {
  return new Promise((resolve, reject) => {
    console.log(`Removing package ${package.reference}`);
    const toRemove = installedPackages.find(pckg => pckg.reference === package.reference);
    if (toRemove && toRemove.filename) {
      fs.unlink(packagesFolder + toRemove.filename, err => {
        if (err) {
          reject(err);
        }
        delete state[package.reference];
        installedPackages = installedPackages.filter(pckg => pckg.reference !== package.reference);
        resolve();
      });
    } else {
      console.log(`Package ${package.reference} not found`);
      resolve();
    }
  });
}

function updatePackage(package) {
  return new Promise((resolve, reject) => {
    console.log(`Updating package ${package.reference}`);
    const toUpdate = installedPackages.find(pckg => pckg.reference === package.reference);
    if (toUpdate && toUpdate.filename) {
      fs.unlink(packagesFolder + toUpdate.filename, err => {
        if (err) {
          reject(err);
        }
        package.download(packagesFolder + package.filename).then(filename => {
          installedPackages = installedPackages.map(pckg => {
            if (pckg.reference === package.reference) {
              return package;
            } else {
              return pckg;
            }
          });
          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    } else {
      console.log(`Package ${package.reference} not found`);
      reject();
    }
  });
}

function installPackage(package) {
  return new Promise((resolve, reject) => {
    console.log(`Installing package ${package.reference}`);
    package.download(packagesFolder + package.filename).then(filename => {
      installedPackages.push(package);
      packageState = {};
      packageState[package.reference] = package.customUpdateData || {};
      Object.assign(state, packageState);
      resolve();
    }).catch(err => {
      reject(err);
    });
  });
}

function handleBarracksResponse(response) {
  return new Promise((resolve, reject) => {
    Promise.all(response.unavailable.map(package => uninstallPackage(package))).then(() => {
      return response.changed.map(package => updatePackage(package));
    }).then(() => {
      return response.available.map(package => installPackage(package));
    }).then(() => {
      resolve();
    }).catch(err => {
      console.error('Package update failed');
      reject(err);
    });
  });
}

function runAllInstalledPackages() {
  return Promise.all(installedPackages.map(pckg => {
    // Remove require cache to be certain that the last version of the file is loaded
    delete require.cache[`${__dirname}/${packagesFolder}${pckg.filename}`];
    const script = require(`./${packagesFolder}${pckg.filename}`);
    return script(state[pckg.reference]);
  }));
}

function checkforUpdate() {
  runAllInstalledPackages().then(() => {
    return getCustomClientData(customClientDataPath);
  }).then(data => {
    return barracks.getDevicePackages(unitId, installedPackages, data);
  }).then(response => {
    return handleBarracksResponse(response);
  }).then(() => {
    console.log('a fini');
  }).catch(err => {
    console.error(err);
  });
}

function messageReceived(message) {
  console.log('Message received, updating device state..');
  let content = JSON.parse(JSON.parse(message.payload));
  state = Object.assign({}, state, content);
}

exports.messageReceived = messageReceived;

checkforUpdate();
setInterval(checkforUpdate, CHECK_INTERVAL);

const that = this;
function listenMessages() {

  messenger.connect({
    onConnect: function() {
      console.log('Connected to ' + messenger.options.mqttEndpoint);
    },
    onError: function(err) {
      console.log('Error occurred : ' + err);
    },
    onClose: function() {
      console.log('Connection closed');
    },
    onReconnect: function() {
      console.log('Attempting to reconnect...');
    }
  });

  messenger.subscribe(messenger.options.apiKey + '.' + messenger.options.unitId, function(messageReceived) {
    that.messageReceived(messageReceived);
    console.log('Received: ' + messageReceived.payload);
  }, { qos: 1 });
}

listenMessages();
