const speedSensor = (state) => {
  return new Promise((resolve, reject) => {
    state.avgSpeed = {
      lastHour: Math.random() * (75 - 20) + 20,
      lastTenMinutes: Math.random() * (80 - 10) + 10
    };
    resolve();
  });
};
module.exports = speedSensor;