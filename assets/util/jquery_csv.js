const fs  = require('fs');
const csv = require('jquery-csv');

process.parentPort.on('message', (e) => {
    let type = e.data.type
    let file = e.data?.filePath
    
    //console.log('JQuery UtilProcess message = ', e.data)
    
    switch (type) {
        case 0: // Read a CSV File
            readCSV(file);
            break;
        case 1:
            //readJSON(file);
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