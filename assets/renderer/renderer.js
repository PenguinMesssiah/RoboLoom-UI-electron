
function linkEventHandlers() {
  document.getElementById("continue-btn").addEventListener('click', () => {
    window.activeWindows.getCalWindow()
  })

  window.serial.onPostSerialPortParse((message) => {
    document.getElementById('error').textContent = message.error_msg
    
    if(message.activeSerialConnection === 0) {
      resetConnection()
    } else {
      setConnectionHTML(message.activeSerialPortPath)
    }
  })
}

// Helper Functions
function resetConnection() {  
  document.getElementById("spinner-container").style.display = 'block'
  document.getElementById("spinner").style.display = 'inline'
  document.getElementById("connecting-message").style.display = 'block'
  document.getElementById("connected-message").style.display = 'none'
  document.getElementById("continue-btn").style.display = 'none'
}

function setConnectionHTML(currentArduinoPortPath) {
  document.getElementById("spinner-container").style.display = 'none'
  document.getElementById("spinner").style.display = 'none'
  document.getElementById("connecting-message").style.display = 'none'
  document.getElementById("connected-message").style.display = 'block'
  document.getElementById("continue-btn").style.display = 'block'
  document.getElementById("serial-port").innerText = currentArduinoPortPath
}

function parsePorts() {
  window.serial.parseSerialPorts()
  setTimeout(parsePorts, 3000)
}

//Execute
resetConnection()
linkEventHandlers()

// Heartbeat that reschedules itself
setTimeout(parsePorts, 3000);

