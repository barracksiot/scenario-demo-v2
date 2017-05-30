const displayDataOnScreen = (state) => {
  return new Promise((resolve, reject) => {
    console.log('Displaying data on screen :');
    console.log(state.screen);
    resolve();
  });
};
module.exports = displayDataOnScreen;