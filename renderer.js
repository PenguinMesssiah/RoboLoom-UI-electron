// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

activeSerialConnection = 0
activeSerialPort = null

/*
const tableify = require('tableify')
async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if(err) {
      document.getElementById('error').textContent = err.message
      return
    } else {
      document.getElementById('error').textContent = ''
    }
    console.log('ports', ports);
    
    if (ports.length === 0) {
      document.getElementById('error').textContent = 'No ports discovered'
    }
    
    tableHTML = tableify(ports)
    console.log(ports)
    document.getElementById('ports').innerHTML = tableHTML
  })
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
    //console.log('ports', ports);
    if (ports.length === 0) {
      document.getElementById('error').textContent = 'No ports discovered'
      resetConnection()
      return
    }

    for (let x in ports) {
      if(ports[x].manufacturer == 'Arduino (www.arduino.cc)') {
        activeSerialConnection = 1 
        activeSerialPort       = ports[x]
        //console.log("activeSerialConnection = ", activeSerialConnection)
        return
      }
    }
    resetConnection()
    //console.log("activeSerialConnection = ", activeSerialConnection)
  })
}

const toggleSpinner = async () => {
  if(activeSerialConnection) {
    document.getElementById('spinner').style.display = hidden
  } else {
    document.getElementById('spinner').style.display = flex
  }
}

function resetConnection() {
  activeSerialConnection = 0
  activeSerialPort       = null
}

function parsePorts() {
  parseSerialPorts();
  setTimeout(parsePorts, 2000);
}

//Execute
parsePorts()
toggleSpinner()

// Heartbeat that reschedules itself
setTimeout(parsePorts, 5000);

