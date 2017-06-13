const windows = (state) => {
  return new Promise((resolve, reject) => {
    console.log("The parking is currently " + state.billing + ". Thank you and goodbye.") 
    console.log("----------------------------------------------------------------------")
    resolve();
  });
};
module.exports = windows;