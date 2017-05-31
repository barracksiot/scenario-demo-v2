const displayDataOnScreen = (state) => {
  return new Promise((resolve, reject) => {
    console.log('Displaying data on screen :');
    console.log(state.text);
    console.log('---------------------------');
    state.displayCount = state.displayCount ? ++state.displayCount : 1;
    resolve();
  });
};
module.exports = displayDataOnScreen;