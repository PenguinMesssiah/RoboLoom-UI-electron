// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.s

activeSerialConnection = 0
activeSerialPort       = null
/*
async function SerialPort() {
  return await window.serial.getSerialObject()
} 
*/

async function parseSerialPorts() {
  await window.serial.getSerial().then((ports, err) => { 
    if(err) {
      document.getElementById('error').textContent = err.message
      resetConnection()
      return
    } else {
      document.getElementById('error').textContent = ''
    }

    if (ports.length === 0) {
      document.getElementById('error').textContent = 'No ports discovered'
      resetConnection()
      return
    }

    for (let x in ports) {
      x = parseInt(x)
      if(ports[x].manufacturer == 'Arduino (www.arduino.cc)') {
        activeSerialConnection = 1 
        activeSerialPort = ports[x]        

        window.serial.sendSerialPath(ports[x].path)
        setConnectionHTML(activeSerialPort)
        //console.log("activeSerialConnection = ", activeSerialConnection)
        break
      } else if (x+1 == ports.length) {
        resetConnection()
      }
    }
    //console.log("activeSerialConnection = ", activeSerialConnection)
  })
}

function linkEventHandlers() {
  document.getElementById("continue-btn").addEventListener('click', () => {
    window.activeWindows.getCalWindow()
  })
}

// Helper Functions for Updating index.html
function resetConnection() {
  activeSerialConnection = 0
  activeSerialPort       = null
  
  document.getElementById("spinner-container").style.display = 'block'
  document.getElementById("spinner").style.display = 'inline'
  document.getElementById("connecting-message").style.display = 'block'
  document.getElementById("connected-message").style.display = 'none'
  document.getElementById("continue-btn").style.display = 'none'
}

function setConnectionHTML(currentArduinoPort) {
  document.getElementById("spinner-container").style.display = 'none'
  document.getElementById("spinner").style.display = 'none'
  document.getElementById("connecting-message").style.display = 'none'
  document.getElementById("connected-message").style.display = 'block'
  document.getElementById("continue-btn").style.display = 'block'
  document.getElementById("serial-port").innerText = currentArduinoPort.path
}

function parsePorts() {
  parseSerialPorts()
  setTimeout(parsePorts, 3000)
}

//Execute
resetConnection()
linkEventHandlers()

// Heartbeat that reschedules itself
setTimeout(parsePorts, 3000);

