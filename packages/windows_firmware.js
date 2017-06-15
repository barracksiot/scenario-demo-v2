const windows = (state) => {
  return new Promise((resolve, reject) => {
    console.log("Currently " + state.billing + ". Thank you and goodbye.") 
    console.log("----------------------------------------------------------------------")
    resolve();
  });
};
module.exports = windows;