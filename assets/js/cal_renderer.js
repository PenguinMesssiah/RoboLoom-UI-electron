function linkEventHandlers() {
    document.getElementById("automatic-btn").addEventListener('click', () => {
      //Enable/Show Continue Button
      document.getElementById("continue-btn").style.display = 'block'
    })

    document.getElementById("manual-btn").addEventListener('click', () => {
      //Enable/Show Continue Button
      document.getElementById("continue-btn").style.display = 'block'
    })

    document.getElementById("shaft-btn").addEventListener('click', () => {
      window.activeWindows.getShaftWindow()
    })
    document.getElementById("jacquard-btn").addEventListener('click', () => {
      window.activeWindows.getJacquardWindow()
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