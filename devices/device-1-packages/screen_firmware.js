const displayDataOnScreen = (state) => {
  return new Promise((resolve, reject) => {
    console.log('Displaying data on screen :');
    console.log(state.text);
    state.displayCount = state.displayCount ? ++state.displayCount : 1;
    console.log('---------------------------');
    resolve();
  });
};
module.exports = displayDataOnScreen;