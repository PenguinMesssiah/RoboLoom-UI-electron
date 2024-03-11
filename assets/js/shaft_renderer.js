//Global Stage & Layer Object(s)
const ROW_MAX  = 20
const COL_MAX  = 40
const DEFAULT  = 4
const BUFFER   = 25

const stage = new Konva.Stage({
    container: 'konva-container', // id of container <div>
    width: 1250,
    height: 700,
    draggable: false
});
const rectLayer = new Konva.Layer();

let num_pedals = DEFAULT
let num_shafts = DEFAULT

function drawWeaveDraft() {
    //Draw Threading (s x n)
    var threadingGroup = new Konva.Group({
        x: 5, 
        y: 5,
        id: 0, 
        width: 1000,
        height: 250,
        draggable: true
    });

    let idx = 0
    for (let i = 0; i < COL_MAX; i++) {
        for (let j = 0; j < num_shafts; j++) {
            console.log("trying to create threading rectangles")
            createRectangle(idx++, i, j, threadingGroup)
        }
    }

    //Draw TieUp (s x p)
    var tieUpGroup = new Konva.Group({
        x: 1025, 
        y: 5,
        id: 1, 
        width: 400,
        height: 400,
        draggable: true
    });

    idx = 0
    for (let i = 0; i < num_pedals; i++) {
        for (let j = 0; j < num_shafts; j++) {
            console.log("trying to create tieUp rectangles")
            createRectangle(idx++, i, j, tieUpGroup)
        }
    }
    
    //Draw Threadling (p x t)
    var threadlingGroup = new Konva.Group({
        x: 1025, 
        y: 125,
        id: 2, 
        width: 400,
        height: 600,
        draggable: true
    });

    idx = 0
    for (let i = 0; i < num_pedals; i++) {
        for (let j = 0; j < ROW_MAX; j++) {
            console.log("trying to create threading rectangles")
            createRectangle(idx++, i, j, threadlingGroup)
        }
    }

    //Draw Drawdown (n x t)
    var drawdownGroup = new Konva.Group({
        x: 5, 
        y: 125,
        id: 2, 
        width: 800,
        height: 800,
        draggable: true
    });

    idx = 0
    for (let i = 0; i < COL_MAX; i++) {
        for (let j = 0; j < ROW_MAX; j++) {
            console.log("trying to create drawdown rectangles")
            createRectangle(idx++, i, j, drawdownGroup)
        }
    }

    rectLayer.add(threadingGroup);
    rectLayer.add(tieUpGroup);
    rectLayer.add(threadlingGroup);
    rectLayer.add(drawdownGroup);
    stage.add(rectLayer);
}

//Create Rectangle with Label
function createRectangle(i, x, y, group) {
    rect = new Konva.Rect({
        width: 25,
        height: 25,
        id: i,
        x: x*BUFFER,
        y: y*BUFFER,
        //fill: 'none',
        stroke: 'black',
        strokeWidth: 2
    })
    
    label = new Konva.Text({
        text:'0',
        id: i,
        x: x*BUFFER,
        y: y*BUFFER,
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#000',
        width: 25,
        padding: 5,
        align: 'center'
    })

    group.add(rect)
    group.add(label)
}

//Execute
drawWeaveDraft()
  