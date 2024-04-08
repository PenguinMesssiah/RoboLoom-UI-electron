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

let threadingArr = null
let tieUpArr     = null
let treadlingArr = null
let drawdownArr  = null
let drawdownArrOld = null

process.parentPort.on('message', (e) => {
    let type  = e.data.type
    let row   = e.data.row
    let col   = e.data.col
    let id    = e.data.id
    let state = e.data?.state
    let matrix = e.data?.drawdown_matrix

    //console.log('utilProcess message = ', e.data)

    switch (type) {
        case 0:
            createArray(row, col, id)
            break;
        case 1:
            updateMatrix(row, col, state, id)
            break;
        case 2:
            setDrawdownMatrix(matrix)
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
            console.log('teiUpArr @ ', pRow,", " ,pCol, " = ", tieUpArr.get([pRow,pCol]))
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
            drawdown_matrix: drawdownArr.valueOf()
        }
        process.parentPort.postMessage(message)
        drawdownArrOld = drawdownArr
    }
}

function setDrawdownMatrix(pMatrix) {
    drawdownArr = math.matrix(pMatrix)
    drawdownArr = math.sparse(drawdownArr)
}
    


