const traficCounter = (state) => {
  return new Promise((resolve, reject) => {
     state.trafic = {
      lastHour: Math.floor(Math.random() * (150 - 15 + 1)) + 15,
      lastTenMinutes: Math.floor(Math.random() * (30 - 1))
    };
    resolve();
  });
};
module.exports = traficCounter;