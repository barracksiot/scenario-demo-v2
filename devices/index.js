#!/usr/bin/env node
const fs = require('fs');
const Barracks = require('barracks-sdk');

const CHECK_INTERVAL = 3000;

const unitId = process.argv[2];
const apiKey = process.argv[3];
const customClientDataPath = process.argv[4];
const packagesFolder = `${unitId}-packages/`;

const barracks = new Barracks({ apiKey });

let packages = [];

function getCustomClientData(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

function checkforUpdate() {
  getCustomClientData(customClientDataPath).then(data => {
    return barracks.getDevicePackages(unitId, packages, data);
  }).then(response => {
    console.log(response);
  }).catch(err => {
    console.error(err);
  });
}

checkforUpdate();
setInterval(checkforUpdate, CHECK_INTERVAL);
