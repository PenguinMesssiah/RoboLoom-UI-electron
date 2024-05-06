const { SerialPort }     = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

//Constants
//General Modes
const MOVE_ROW = 1
const CAL      = 2
//Calibration Modes
const CAL_MOVE_SMALL = 1
const CAL_SET_MOTOR  = 2
const CAL_SET_ALL    = 3

const numMotors = 40
const numFrames = 4     //TODO: Make Dynamic

const readLineParser = new ReadlineParser({ 
    delimiter: '\n',
    encoding: 'utf-8'
})

//Globals
let motor_pos = Array(numMotors).fill(-1)
let frame_pos = Array(numFrames).fill(-1)

let error_msg              = null
let activeSerialPort       = null
let activeSerialConnection = null

//Read Data From Serial, Transformed by Parser
readLineParser.on('data', (data) => {
    console.log("received data: ", data)
})

process.parentPort.on('message', (e) => {
    let type      = e.data.type
    let motorInt  = e.data?.motorInt
    let direction = e.data?.direction
    let rowToMove = e.data?.rowToMove
    
    //console.log("Serial Utility Process: Message w/ type ", type)

    switch(type) {
        case 0: //Parse Ports
            parseSerialPorts()
            break;
        case 1: //Calibration Single Motor Cmd
            console.log("Sending Cal Motor motor: ", motorInt, " with dir ", direction)
            moveMotor(CAL, CAL_MOVE_SMALL, motorInt, direction)
            break;
        case 2: //Calibrate All Motors Cmd
            console.log("Sending Cal All Motor's w/ dir ", direction)
            calibrateAll(direction)
            break;
        case 3: //Move Row Cmd
            console.log("Serial Utility Process: Message w/ type ", type)
            moveRow(rowToMove)
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
            activeSerialPortPath: activeSerialPort?.path,
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

        activeSerialPort.pipe(readLineParser)
        console.log("Serial Utility Process: Serial Connection Open")
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

function sendSerialCommand(msg) {
    let mode      = msg.mode
    let cal_mode  = msg?.cal_mode
    let direction = msg?.direction
    let motor     = msg?.motor 
    let rowToMove = msg?.rowToMove

    var serialMsg = ""

    switch(mode) {
        case MOVE_ROW:
            serialMsg = (String(mode) + String(rowToMove) + '\n').replace(/,+/g,'');
            //console.log("Send Move Row w/ ", serialMsg)
            activeSerialPort.write(serialMsg)
            break;
        case CAL:
            switch(cal_mode) {
                case (CAL_MOVE_SMALL || CAL_SET_MOTOR): //move single motor small increment cmd | bi-directinal
                    serialMsg = String(mode) + String(cal_mode) + String(direction) + String(motor).padStart(2, '0') + '\n';
                    //console.log(serialMsg)
                    activeSerialPort.write(serialMsg)
                    break;
                case CAL_SET_ALL: // set single motor or all motor's calibration state | bi-directional
                    serialMsg = String(mode) + String(cal_mode) + String(direction) + '\n'
                    //console.log("Send Cal Set w/ ", serialMsg)
                    activeSerialPort.write(serialMsg)
                    break;
            }    
            break;
    }
}

//Send Cmd For Operating Single Motor
function moveMotor(mode, cal_mode, motor, direction) {
    let msg = {
        mode:      mode,
        cal_mode:  cal_mode,
        direction: direction,
        motor:     motor
    }
    sendSerialCommand(msg)
}

function calibrateAll(direction) {
    let msg = {
        mode:      CAL,
        cal_mode:  CAL_SET_ALL,
        direction: direction
    }
    sendSerialCommand(msg)

    for (let i = 0; i < numMotors; i++) {
        motor_pos[i] = direction
    }
}

function moveRow(row) {
    //console.log("Row = ", row)
    let msg = {
        mode:      MOVE_ROW,
        rowToMove: row
    }
    sendSerialCommand(msg)

    for (let i = 0; i < numMotors; i++) {
        motor_pos[i] = row[i]
    }
}
