const traficJamDetector = (state) => {
  return new Promise((resolve, reject) => {
    const rand = Math.floor(Math.random() * (10 - 2)) + 1
    state.trafic = {
       jammed: (rand % 2) ? true : false
    };
    resolve();
  });
};
module.exports = traficJamDetector;