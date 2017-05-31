function sendCommand(callback) {
  if (callback) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
    let randomData = "";

    for (let i=0; i < 35; ++i) {
      randomData += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    callback({ "io.barracks.firmware.screen": { text: randomData } });
  }
}

class BarracksMessengerMock {

  constructor() {
    this.callback = undefined;
    const that = this;
    setInterval(() => {
      sendCommand(that.callback);
    }, 4500);
  }

  onMessage(callback) {
    this.callback = callback;
  }
}

module.exports = BarracksMessengerMock;