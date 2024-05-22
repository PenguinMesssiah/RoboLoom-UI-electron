const { create, all } = require('mathjs') 
const config = {
  epsilon: 1e-12,
  matrix: 'Matrix',
  number: 'number',
  precision: 64,
  predictable: false,
  randomSeed: null
}
const math = create(all, config)

const THREADING_ID = 0
const TIEUP_ID     = 1
const TREADLING_ID = 2
const DRAWDOWN_ID  = 3
const COL_MAX      = 40
const ROW_MAX      = 20

let threadingArr = null
let tieUpArr     = null
let treadlingArr = null
let drawdownArr  = null
let drawdownArrOld = null

process.parentPort.on('message', (e) => {
    let type  = e.data.type
    let row   = e.data?.row
    let col   = e.data?.col
    let id    = e.data?.id
    let state    = e.data?.state
    let matrix   = e.data?.drawdown_matrix
    let rowIndex = e.data?.rowIndex
    let numShaft = e.data?.num_shafts
    let numPedal = e.data?.num_pedals
    let threading = e.data?.threading
    let tieUp     = e.data?.tieUp
    let treadling = e.data?.treadling

    //console.log('Matrix Utility Process Message w/ type ', e.data, {'maxArrayLength': null})

    switch (type) {
        case 0: //Create Array Cmd
            createArray(row, col, id)
            break;
        case 1: //Update Single Matrix Element
            updateMatrix(row, col, state, id)
            break;
        case 2: //Initialize Drawdown Matrix w/ Data
            setDrawdownMatrix(matrix)
            break;
        case 3: //Getter for Single Row of Drawdown Matrix
            getDrawdownMatrixRow(rowIndex)
            break;
        case 4: //Getter for Threading, Tie-up, & Treadling
            getMatricies(numShaft, numPedal)
            break;
        case 5: //Initialize Threading, TieUp, & Treadling w/ Data
            setAll(numShaft, numPedal, threading, tieUp, treadling)
            break;
    }
})

function createArray(pRow, pCol, pId) {
    switch(pId) {
        case THREADING_ID:
            threadingArr = math.zeros(pRow, pCol, 'sparse')
            break;
        case TIEUP_ID:
            tieUpArr = math.zeros(pRow, pCol, 'sparse')
            break;
        case TREADLING_ID:
            treadlingArr = math.zeros(pRow, pCol, 'sparse')
            break;
        case DRAWDOWN_ID:
            drawdownArr    = math.zeros(pRow, pCol, 'sparse')
            drawdownArrOld = math.zeros(pRow, pCol, 'sparse')
            break;
    }
}

function updateMatrix (pRow, pCol, pState, pId) {
    switch(pId) {
        case THREADING_ID:
            threadingArr.set([pRow, pCol], pState)
            console.log('threadingArr @ ', pRow,", " ,pCol, " = ", threadingArr.get([pRow,pCol]))
            break;
        case TIEUP_ID:
            tieUpArr.set([pRow, pCol], pState)
            console.log('tieUpArr @ ', pRow,", " ,pCol, " = ", tieUpArr.get([pRow,pCol]))
            break;
        case TREADLING_ID:
            treadlingArr.set([pRow, pCol], pState)
            console.log('treadlingArr @ ', pRow,", " ,pCol, " = ", treadlingArr.get([pRow,pCol]))
            break;
        case DRAWDOWN_ID:
            drawdownArr.set([pRow, pCol], pState)
            console.log('drawdownArr @ ', pRow,", " ,pCol, " = ", drawdownArr.get([pRow,pCol]))
            break;
    }

    //Compute Drawdown
    var tieUpArr_Transpose = math.transpose(tieUpArr)
    var x = math.multiply(tieUpArr_Transpose, threadingArr)
    drawdownArr = math.multiply(treadlingArr, x)

    if(!math.deepEqual(drawdownArr, drawdownArrOld)) {
        let message = {
            type: 0,
            drawdown_matrix: drawdownArr.valueOf()
        }
        process.parentPort.postMessage(message)
        drawdownArrOld = drawdownArr
    }
}

function getDrawdownMatrixRow(rowIndex) {
    let row = drawdownArr.valueOf()[rowIndex]
    
    let message = {
        type: 1,
        rowToMove: row
    }
    process.parentPort.postMessage(message)
}

function setDrawdownMatrix(pMatrix) {
    drawdownArr = math.matrix(pMatrix)
    drawdownArr = math.sparse(drawdownArr)
}
 
function getMatricies(numShaft, numPedal) {
    let threading_arr = threadingArr.valueOf() 
    let tieup_arr     = tieUpArr.valueOf()
    let treadling_arr = treadlingArr.valueOf()

    let message = {
        type: 2,
        num_pedals: numPedal,
        num_shafts: numShaft,
        threading: threading_arr,
        tieUp:     tieup_arr,
        treadling: treadling_arr
    }

    process.parentPort.postMessage(message)
}

function setAll(numShaft, numPedal, threading, tieUp, treadling) {
    //Create Temp Arrays
    var threadingArr_Transpose = math.zeros(COL_MAX, numShaft, 'sparse')
    var tieUpArr_Transpose     = math.zeros(numPedal, numShaft, 'sparse')
    var treadlingArr_Transpose = math.zeros(numPedal, ROW_MAX, 'sparse')
    
    //Populate then Transpose
    var count = 0;
    threadingArr_Transpose = threadingArr_Transpose.map(function(value, index, threadingArr_Transpose) {
        return threading[count++]
    })
    count = 0;
    tieUpArr_Transpose = tieUpArr_Transpose.map(function() {
        return tieUp[count++]
    })
    count = 0;
    treadlingArr_Transpose = treadlingArr_Transpose.map(function() {
        return treadling[count++]
    })

    threadingArr = math.transpose(threadingArr_Transpose)
    tieUpArr     = math.transpose(tieUpArr_Transpose)
    treadlingArr = math.transpose(treadlingArr_Transpose)

    //Send Message to Update Shaft Renderer
    let message = {
        type: 3,
        numShaft: numShaft,
        numPedal: numPedal,
        threading: threadingArr.valueOf(),
        tieUp:     tieUpArr.valueOf(),
        treadling: treadlingArr.valueOf()
    }
    process.parentPort.postMessage(message)

    //Compute Drawdown
    var x = math.multiply(tieUpArr_Transpose, threadingArr)
    drawdownArr = math.multiply(treadlingArr, x)

    if(!math.deepEqual(drawdownArr, drawdownArrOld)) {
        let message = {
            type: 0,
            drawdown_matrix: drawdownArr.valueOf()
        }
        process.parentPort.postMessage(message)
        drawdownArrOld = drawdownArr
    }

    /* Error Printing
    console.dir(threading, {'maxArrayLength': null});
    threadingArr.forEach(function (value, index, threadingArr) {
        console.log('value:', value, 'index:', index) 
    })
    */
}

