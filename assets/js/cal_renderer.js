function linkEventHandlers() {
    document.getElementById("manual-btn").addEventListener('click', () => {
      console.log("window object = ", window)
      window.activeWindows.getManCalWindow()
    })
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
linkEventHandlers()