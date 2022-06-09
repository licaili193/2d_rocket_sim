const mainApp = new App();

function startClicked() {
  console.log("HERE");
  mainApp.onStart();
}

function stopClicked() {
  mainApp.onStop();
}