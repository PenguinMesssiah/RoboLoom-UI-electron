function linkEventHandlers() {
    document.getElementById("manual-btn").addEventListener('click', setWindowSize)
}

function setWindowSize(){
  window.setSize(1000, 400)
}

function sendMotorUpCommand(motorInt) {
  //Invoke a Channel, Send Command over Serial in Main
  console.log("Send UP on motor number: ", motorInt)
}

function sendMotorDownCommand(motorInt) {
  //Invoke a Channel, Send Command over Serial in Main
  console.log("Send DOWN on motor number: ", motorInt)
}

//Execute
//linkEventHandlers()