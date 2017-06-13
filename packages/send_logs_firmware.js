const sendLogs = (state) => {
  return new Promise((resolve, reject) => {
    console.log('The device is now allowed to send logs to the third party apps.');
    send.logs = true
    console.log('---------------------------');
    resolve();
  });
};
module.exports = sendLogs;