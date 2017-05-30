#!/usr/bin/env node
const fs = require('fs');
const Barracks = require('barracks-sdk');

const CHECK_INTERVAL = 3000;
const DEFAULT_SCREEN_DATA = 'Default text to display';

const unitId = process.argv[2];
const apiKey = process.argv[3];
const customClientDataPath = process.argv[4];
const packagesFolder = `${unitId}-packages/`;

const barracks = new Barracks({ apiKey });

let packages = [];
let state = {};

function getCustomClientData(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(Object.assign(
          {},
          JSON.parse(data),
          { data: state }
        ));
      }
    });
  });
};

function runAllInstalledPackages() {
  // TODO find and run all installed packages
  return Promise.resolve();
}

function checkforUpdate() {
  getCustomClientData(customClientDataPath).then(data => {
    return barracks.getDevicePackages(unitId, packages, data);
  }).then(response => {
    console.log(response);
    return runAllInstalledPackages();
  }).then(() => {
    console.log('a fini');
  }).catch(err => {
    console.error(err);
  });
}

function initState() {
  getCustomClientData(customClientDataPath).then(data => {
    if (data.modules.screen) {
      state.screen = DEFAULT_SCREEN_DATA;
    }
  }).catch(err => {
    console.error(err);
  });
}

initState();
checkforUpdate();
setInterval(checkforUpdate, CHECK_INTERVAL);
