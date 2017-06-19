const fs = require('fs')
const readLine = require('readline')

const sendLogs = (state) => {
  return new Promise((resolve, reject) => {
    console.log('The device is now allowed to send logs to the third party apps.');
    state.data = [];

    var lineReader = readLine.createInterface({
    input: fs.createReadStream('/proc/loadavg')
    });

    lineReader.on('line', function (line) {
    state.data.push(line);
    });

    console.log('---------------------------');
    resolve();
  });
};
module.exports = sendLogs;