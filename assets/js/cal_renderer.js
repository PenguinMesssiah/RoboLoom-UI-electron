function linkEventHandlers() {
    document.getElementById("automatic-btn").addEventListener('click', () => {
      //Enable/Show Continue Button
      document.getElementById("continue-btn").style.display = 'block'
    })

    document.getElementById("manual-btn").addEventListener('click', () => {
      //Enable/Show Continue Button
      document.getElementById("continue-btn").style.display = 'block'
    })

    document.getElementById("continue-btn").addEventListener('click', () => {
      window.activeWindows.getShaftWindow()
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