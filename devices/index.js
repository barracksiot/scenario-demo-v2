#!/usr/bin/env node
const fs = require('fs');
const Barracks = require('barracks-sdk');

const CHECK_INTERVAL = 3000;

const unitId = process.argv[2];
const apiKey = process.argv[3];
const customClientDataPath = process.argv[4];
const packagesFolder = `${unitId}-packages/`;

const barracks = new Barracks({ apiKey });

let installedPackages = [];
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

function uninstallPackage(package) {
  return new Promise((resolve, reject) => {
    console.log(`Removing package ${package.reference}`);
    const toRemove = installedPackages.find(pckg => pckg.reference === package.reference);
    if (toRemove && toRemove.filename) {
      fs.unlink(packagesFolder + toRemove.filename, err => {
        if (err) {
          reject(err);
        }
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
      resolve();
    }).catch(err => {
      reject(err);
    });
  });
}

function handleBarracksResponse(response) {
  return new Promise((resolve, reject) => {
    console.log(response);
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
  // TODO find and run all installed packages
  return Promise.resolve();
}

function checkforUpdate() {
  getCustomClientData(customClientDataPath).then(data => {
    return barracks.getDevicePackages(unitId, installedPackages, data);
  }).then(response => {
    return handleBarracksResponse(response);
  }).then(() => {
    return runAllInstalledPackages();
  }).then(() => {
    console.log('a fini');
  }).catch(err => {
    console.error(err);
  });
}

checkforUpdate();
setInterval(checkforUpdate, CHECK_INTERVAL);
