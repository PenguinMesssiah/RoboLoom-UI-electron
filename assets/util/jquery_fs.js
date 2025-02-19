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
            readTxt(file);
            break;
        case 1: //Save Matricies in File
            writeToFile(numShaft, numPedal, threading, tieUp, treadling);
            break;
        case 2: //
            readCSV(file);
            break;
    }
})

function readTxt(file) {
    fs.readFile(file, 'UTF-8', function (err, fileData) {
        if (err) { console.log("JQuery Utility Process ERROR: ", err); }

        fileData = fileData.split("\n")

        let num_shafts = parseInt(fileData[0].replace("shafts: ", ''))
        let num_pedals = parseInt(fileData[1].replace("pedals: ", ''))

        let threading = fileData[2].replace("threading: ", '')
        let tieUp     = fileData[3].replace("tieUp: ", '')
        let treadling = fileData[4].replace("treadling: ", '')

        threading = threading.split(',').map(Number);
        tieUp     = tieUp.split(',').map(Number); 
        treadling = treadling.split(',').map(Number); 
        
        let message = {
            type: 0, 
            num_shafts: num_shafts,
            num_pedals: num_pedals,
            threading: threading,
            tieUp: tieUp,
            treadling: treadling,
        }
        process.parentPort.postMessage(message)
    });
}

function writeToFile(numShaft, numPedal, threading, tieUp, treadling) {
    let temp = "shafts: " + numShaft + '\n' +
                "pedals: " + numPedal + '\n' +
                "threading: " + threading + '\n' +
                "tieUp: " + tieUp + '\n' + 
                "treadling: " + treadling + '\n'

    fs.writeFile('./weavingDraft.txt', temp, function (err) {
        if (err) throw err;
    });
}

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