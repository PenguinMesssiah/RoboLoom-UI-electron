const fs  = require('fs');
const csv = require('jquery-csv');

process.parentPort.on('message', (e) => {
    let type = e.data.type
    let file = e.data?.filePath

    let numShaft  = e.data?.num_shafts
    let numPedal  = e.data?.num_pedals
    let threading = e.data?.threading
    let tieUp     = e.data?.tieUp
    let treadling = e.data?.treadling
    
    //console.log('JQuery UtilProcess message = ', e.data)
    
    switch (type) {
        case 0: // Read a CSV File
            readCSV(file);
            break;
        case 1: //Save Matricies in File
            writeToFile(numShaft, numPedal, threading, tieUp, treadling);
            break;
        case 2: //
            //exportToFile(json);
            break;
    }
})

function readCSV(file) {
    fs.readFile(file, 'UTF-8', function (err, fileData) {
        if (err) { console.log("JQuery Utility Process ERROR: ", err); }

        csv.toArrays(fileData, {}, function (err, data) {
            if (err) { console.log("JQuery Utility Process CSV ERROR: ", err); }

            let message = {
                drawdown_matrix: data,
                row: data.length,
                col: data[0].length
            }
            process.parentPort.postMessage(message)
        });
    });
}

function writeToFile(numShaft, numPedal, threading, tieUp, treadling) {
    let temp = "shafts: " + numShaft + '\n' +
                "pedals: " + numPedal + '\n' +
                "threading: " + threading + '\n' +
                "tieUp: " + tieUp + '\n' + 
                "treadling: " + treadling + '\n'

    fs.writeFile('./assets/data/weavingDraft.txt', temp, function (err) {
        if (err) throw err;
    });
}