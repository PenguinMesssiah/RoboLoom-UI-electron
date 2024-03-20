const zeros = require("@stdlib/ndarray/zeros");

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
    }
})

function createArray(pRow, pCol, pId) {
    switch(pId) {
        case THREADING_ID:
            threadingArr = zeros([pRow, pCol], {'dtype': 'uint8'})
            break;
        case TIEUP_ID:
            tieUpArr = zeros([pRow, pCol], {'dtype': 'uint8'})
            break;
        case TREADLING_ID:
            treadlingArr = zeros([pRow, pCol], {'dtype': 'uint8'})
            break;
        case DRAWDOWN_ID:
            drawdownArr = zeros([pRow, pCol], {'dtype': 'uint8'})
            break;
    }
}

function updateMatrix (pRow, pCol, pState, pId) {
    switch(pId) {
        case THREADING_ID:
            threadingArr.set(pRow, pCol, pState)
            console.log('threadingArr @ ', pRow,", " ,pCol, " = ", threadingArr.get(pRow,pCol))
            break;
        case TIEUP_ID:
            tieUpArr.set(pRow, pCol, pState)
            console.log('teiUpArr @ ', pRow,", " ,pCol, " = ", threadingArr.get(pRow,pCol))
            break;
        case TREADLING_ID:
            treadlingArr.set(pRow, pCol, pState)
            console.log('treadlingArr @ ', pRow,", " ,pCol, " = ", threadingArr.get(pRow,pCol))
            break;
        case DRAWDOWN_ID:
            drawdownArr.set(pRow, pCol, pState)
            console.log('drawdownArr @ ', pRow,", " ,pCol, " = ", threadingArr.get(pRow,pCol))
            break;
    }
}


