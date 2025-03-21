const UP   = 1
const DOWN = 0

function linkEventHandlers() {
    document.getElementById("automatic-btn").addEventListener('click', () => {
      //Send Calibrate All Cmd
      //TODO: Make Configurable
      window.serial.sendAutoCalCmd(DOWN)
      //Enable/Show Continue Button
      document.getElementById("continue-btn").style.display = 'block'
    })

    document.getElementById("manual-btn").addEventListener('click', () => {
      //Enable/Show Continue Button
      document.getElementById("continue-btn").style.display = 'block'
    })

    document.getElementById("shaft-btn").addEventListener('click', () => {
      window.app.changeView(1,2)
    })
    document.getElementById("jacquard-btn").addEventListener('click', () => {
      window.app.changeView(1,3)
    })
}

function sendMotorUpCommand(motorInt) {
  window.serial.sendMotorCmd(motorInt, UP)
  //console.log("Send UP on motor number: ", motorInt)
}

function sendMotorDownCommand(motorInt) {
  window.serial.sendMotorCmd(motorInt, DOWN)
  //console.log("Send DOWN on motor number: ", motorInt)
}

function setMotorPos(motorInt) {
  window.serial.setMotorPosCmd(motorInt, DOWN)
  //console.log("Set DOWN on motor number: ", motorInt)
}
//Execute
linkEventHandlers()