const ROW_MAX  = 20
const COL_MAX  = 40
const DEFAULT  = 4
const BUFFER   = 25

/*
    Konva is in (c,r) format by default
    where (y,x) represent the horizontal & vertical axis respectively 
*/
const stage = new Konva.Stage({
    container: 'konva-container',
    width: 1250,
    height: 700,
    draggable: false
});
const rectLayer = new Konva.Layer();

const cmain       = 'black'
const cmainFill   = 'white'
const calternate  = 'blue'
const calternativeFill = '#0080FF'
const cgreen      = 'green'

let num_pedals = DEFAULT
let num_shafts = DEFAULT

function drawWeaveDraft() {
    let idx = 0
    
    //Draw Threading & Create Array (s x n)
    var threadingGroup = new Konva.Group({
        x: 5, 
        y: 5,
        id: 'threadingGroup',
        width: 1000,
        height: 250
    });

    for (let i = 0; i < COL_MAX; i++) {
        for (let j = 0; j < num_shafts; j++) {
            createRectangle(idx++, i, j, threadingGroup)
        }
    }
    window.ndarray.createArray(num_shafts, COL_MAX, 0)

    //Draw TieUp & Create Array (s x p)
    var tieUpGroup = new Konva.Group({
        x: 1025, 
        y: 5,
        id: 'tieUpGroup', 
        width: 400,
        height: 400
    });

    for (let i = 0; i < num_pedals; i++) {
        for (let j = 0; j < num_shafts; j++) {
            createRectangle(idx++, i, j, tieUpGroup)
        }
    }
    window.ndarray.createArray(num_shafts, num_pedals, 1)
    
    //Draw Threadling & Create Array (p x t)
    var treadlingGroup = new Konva.Group({
        x: 1025, 
        y: 125,
        id: 'treadlingGroup', 
        width: 400,
        height: 600
    });

    for (let i = 0; i < num_pedals; i++) {
        for (let j = 0; j < ROW_MAX; j++) {
            createRectangle(idx++, i, j, treadlingGroup)
        }
    }
    window.ndarray.createArray(ROW_MAX, num_pedals, 2)

    //Draw Drawdown & Create Array  (n x t)
    var drawdownGroup = new Konva.Group({
        x: 5, 
        y: 125,
        id: 'drawdownGroup', 
        width: 800,
        height: 800
    });

    for (let i = 0; i < COL_MAX; i++) {
        for (let j = 0; j < ROW_MAX; j++) {
            createRectangle(idx++, i, j, drawdownGroup)
        }
    }
    window.ndarray.createArray(ROW_MAX, COL_MAX, 3)

    rectLayer.add(threadingGroup);
    rectLayer.add(tieUpGroup);
    rectLayer.add(treadlingGroup);
    rectLayer.add(drawdownGroup);
    stage.add(rectLayer);
    
    stage.on('click', function (e) {
        //Decompose Event
        let text_obj = e.target
        let obj_id   = 'rect_' + text_obj.id().toString()
        let cRect    = stage.find("."+obj_id)[0]

        //console.log("cRect = ", cRect.getAncestors()[0].id())
        //console.log("printing cRect (", cRect.y()/BUFFER,",",cRect.x()/BUFFER,")")

        let state = toggleObj(text_obj, cRect)
        updateMatrixElement(cRect, state)
        
        rectLayer.draw()
    })
}

//Update Matrix
function updateMatrixElement(pRect, pState) {
    var row   = pRect.y()/BUFFER
    var col   = pRect.x()/BUFFER
    var group = pRect.getAncestors()[0].id()
    
    switch(group) {
        case 'threadingGroup':
            window.ndarray.updateMatrix(row, col, pState, 0)
            break;
        case 'tieUpGroup':
            window.ndarray.updateMatrix(row, col, pState, 1)
            break;
        case 'treadlingGroup':
            window.ndarray.updateMatrix(row, col, pState, 2)
            break;
        case 'drawdownGroup':
            window.ndarray.updateMatrix(row, col, pState, 3)
            break;
    }
}


//Toggle Rect & Text Obj
function toggleObj(pText, pRect) {
    var bool = null
    
    //Handle Click on Text
    if(pText.text() == '0') {
        bool = 1
        pText.text('1')
        pText.fill(calternate)
    } else if(pText.text() == '1') {
        bool = 0
        pText.text('0')
        pText.fill(cmain)
    }

    //Handle Click on Rect
    if (pRect.fill() == cmainFill) {
        pRect.fill(calternativeFill)
    } else if (pRect.fill() == calternativeFill) {
        pRect.fill(cmainFill);
    }

    return bool
}

//Create Rectangle with Label
function createRectangle(i, x, y, group) {
    var name = "rect_" + i.toString()
    
    rect = new Konva.Rect({
        width: 25,
        height: 25,
        name: name,
        cornerRadius: 1,
        x: x*BUFFER,
        y: y*BUFFER,
        fill: cmainFill,
        stroke: cmain,
        strokeWidth: 1,
        zindex: 0
    })
    
    label = new Konva.Text({
        text:'0',
        id: i,
        x: x*BUFFER,
        y: y*BUFFER,
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: cmain,
        width: 25,
        padding: 5,
        align: 'center',
        zindex: 10
    })

    group.add(rect)
    group.add(label)
}

//Execute
drawWeaveDraft()