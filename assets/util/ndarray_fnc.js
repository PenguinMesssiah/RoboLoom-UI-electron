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

process.parentPort.on('message', (e) => {
    let type  = e.data.type
    let row   = e.data.row
    let col   = e.data.col
    let id    = e.data.id
    let state = e.data?.state

    //console.log('utilProcess message = ', e.data)

    switch (type) {
        case 0:
            createArray(row, col, id)
            break;
        case 1:
            updateMatrix(row, col, state, id)
            break;
        case 2:
            matrixMultiply()
            break;
    }
})

function createArray(pRow, pCol, pId) {
    switch(pId) {
        case THREADING_ID:
            threadingArr = math.zeros(pRow, pCol)
            break;
        case TIEUP_ID:
            tieUpArr = math.zeros(pRow, pCol)
            break;
        case TREADLING_ID:
            treadlingArr = math.zeros(pRow, pCol)
            break;
        case DRAWDOWN_ID:
            drawdownArr = math.zeros(pRow, pCol)
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
}

function matrixMultiply() {
    var tieUpArr_Transpose = math.transpose(tieUpArr)
    console.log("\nthreadingArr= ", threadingArr)
    console.log("\ntieUpArrT= ", tieUpArr)
    console.log("\ttreadling= ", treadlingArr)
    console.log("\ndrawdown= ", drawdownArr)
    
    
    var x = math.multiply(tieUpArr_Transpose, threadingArr)
    console.log("\nx= ", x)
}
    


