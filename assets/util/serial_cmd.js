const { SerialPort } = require('serialport')

let error_msg              = null
let activeSerialPort       = null
let activeSerialConnection = null

process.parentPort.on('message', (e) => {
    let type = e.data.type
    
    //console.log("Serial Utility Process: Message w/ type ", type)

    switch(type) {
        case 0:
            parseSerialPorts()
            break;
    }
})

async function parseSerialPorts() {
    await SerialPort.list().then((ports, err) => { 
        if(err) { 
            error_msg = err.message
            return
        } else { error_msg = '' }

        if (ports.length === 0) {
            error_msg = 'No ports discovered'
            return
        }
  
        for (let x in ports) {
            x = parseInt(x)
            if(ports[x].manufacturer == 'Arduino (www.arduino.cc)') {
                activeSerialPort       = ports[x]        
                activeSerialConnection = 1 

                openSerialConnetion(ports[x].path)
                //console.log("activeSerialConnection = ", activeSerialConnection)
                break
            } else if (x+1 == ports.length) {
                activeSerialPort       = null     
                activeSerialConnection = 0 
            }
        }

        let message = {
            error_msg: error_msg,
            activeSerialPort: activeSerialPort,
            activeSerialConnection: activeSerialConnection
        }
        process.parentPort.postMessage(message)
        //console.log("activeSerialConnection = ", activeSerialConnection)
    })
}

function openSerialConnetion(path) {
    //console.log("path = ", path)
    if(activeSerialPort == null) {
        activeSerialPort = new SerialPort({
            path: path,
            baudRate: 115200,
            autoOpen: true
        })
    }
    /*
    activeSerialPort.open(function (err) {
        if (err) {
            return console.log('Error opening port: ', err.message)
        }
        else {
            //Because there's no callback to write, write errors will be emitted on the port:
            //port.write('main screen turn on')
            console.log('Serial Port Open on ', activeSerialPort.path, ' and baudrate: ', activeSerialPort.baudRate)
        }
    })
    */
}