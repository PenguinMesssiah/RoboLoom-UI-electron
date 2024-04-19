const { SerialPort }     = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

//Constants
const CALIBRATE = 0
const MOVE      = 1
const FRAME     = 2
const UP        = 1
const DOWN      = 0
const numMotors = 40
const numFrames = 4     //TODO: Make Dynamic
const CALIBRATION    = 1
const NOCALIBRATION  = 0
//const FRAME_CONFIG   = '101101'
const AUTO_CAL = 51
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
            console.log("sending on motor: ", motorInt, " with dir ", direction)
            moveMotor(motorInt, direction, CALIBRATE, NOCALIBRATION)
            break;
        case 2: //Calibrate All Motors Cmd
            calibrateAll()
            break;
        case 3: //Move Row Cmd
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
        console.log("Serial Connection Open")
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

function convertToMsgString(motor, direction, mode, calibration) {
    return String(motor << 4 | direction << 3 | mode << 1 | calibration)
}

// function moveMotor(motor, direction, mode, calibration) NEW
// function moveMotor(motor, calibration, direction, mode) old

//Send Single Motor Or Fram Move Command
function moveMotor(motor, direction, mode, calibration) {
    activeSerialPort.write(convertToMsgString(motor, direction, mode, calibration))
    if (mode === MOVE) {
        motor_pos[motor] = direction
    } else if (mode === FRAME){
        frame_pos[motor] = direction
    }
}

function moveRow(row) {
    for (let [index, motorPos] of row.entries()) {
        if(motorPos == 1 && motor_pos[index] !== UP) {
            moveMotor(index, UP, MOVE, NOCALIBRATION)
        }
    }
    for (let [index, motorPos] of row.entries()) {
        if(motorPos == 0 && motor_pos[index] !== DOWN)  {
            moveMotor(index, DOWN, MOVE, NOCALIBRATION)
         }
    }
}

function moveFrame(frames) {
    for (let [index, framePos] of frames.entries()) {
        if(framePos == 1 && frame_pos[index] !== UP) {
            moveMotor(index, UP, FRAME, NOCALIBRATION)
        }
    }
    for (let [index, framePos] of frames.entries()) {
        if(framePos == 0 && frame_pos[index] !== DOWN)  {
            moveMotor(index, DOWN, FRAME, NOCALIBRATION)
         }
    }
}

function calibrateAll() {
    activeSerialPort.write(convertToMsgString(AUTO_CAL, DOWN, CALIBRATE, CALIBRATION))
    for (let i = 0; i < numMotors; i++) {
        motor_pos[i] = DOWN
    }
    for (let i = 0; i < numFrames; i++){
        frame_pos[i] = DOWN
    }
}