//Global Stage & Layer Object(s)
const ROW_MAX  = 20
const COL_MAX  = 40
const DEFAULT  = 4
const BUFFER   = 25

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
const cgreen = 'green'

let num_pedals = DEFAULT
let num_shafts = DEFAULT

function drawWeaveDraft() {
    //Draw Threading (s x n)
    var threadingGroup = new Konva.Group({
        x: 5, 
        y: 5,
        id: 0, 
        width: 1000,
        height: 250
    });

    let idx = 0
    for (let i = 0; i < COL_MAX; i++) {
        for (let j = 0; j < num_shafts; j++) {
            createRectangle(idx++, i, j, threadingGroup)
        }
    }

    //Draw TieUp (s x p)
    var tieUpGroup = new Konva.Group({
        x: 1025, 
        y: 5,
        id: 1, 
        width: 400,
        height: 400
    });

    //idx = 0
    for (let i = 0; i < num_pedals; i++) {
        for (let j = 0; j < num_shafts; j++) {
            createRectangle(idx++, i, j, tieUpGroup)
        }
    }
    
    //Draw Threadling (p x t)
    var threadlingGroup = new Konva.Group({
        x: 1025, 
        y: 125,
        id: 2, 
        width: 400,
        height: 600
    });

    //idx = 0
    for (let i = 0; i < num_pedals; i++) {
        for (let j = 0; j < ROW_MAX; j++) {
            createRectangle(idx++, i, j, threadlingGroup)
        }
    }

    //Draw Drawdown (n x t)
    var drawdownGroup = new Konva.Group({
        x: 5, 
        y: 125,
        id: 2, 
        width: 800,
        height: 800
    });

    //idx = 0
    for (let i = 0; i < COL_MAX; i++) {
        for (let j = 0; j < ROW_MAX; j++) {
            createRectangle(idx++, i, j, drawdownGroup)
        }
    }

    rectLayer.add(threadingGroup);
    rectLayer.add(tieUpGroup);
    rectLayer.add(threadlingGroup);
    rectLayer.add(drawdownGroup);
    stage.add(rectLayer);
    
    stage.on('click', function (e) {
        var text_obj = e.target
        var obj_id   = 'rect_' + text_obj.id().toString()
        //console.log("Clicked on obj with id = ", obj_id)
        //console.log("obj of type = ", text_obj.getClassName())
        
        //Find Corresponding Rectangle
        var cRect = stage.find("."+obj_id)[0]
        //console.log("looking for id= ", obj_id, cRect)
        //console.log("Found Obj w/ id , ", cRect.name(), ', of type', cRect.getClassName())
        
        //Handle Click on Text
        if(text_obj.text() == '0') {
            text_obj.text('1')
            text_obj.fill(calternate)
            //text_obj.zIndex(100)
        } else if(text_obj.text() == '1') {
            text_obj.text('0')
            text_obj.fill('cmain') 
            //text_obj.zIndex(0) 
        }

        //Handle Click on Rect
        if (cRect.fill() == cmainFill) {
            cRect.fill(calternativeFill)
        } else if (cRect.fill() == calternativeFill) {
            cRect.fill(cmainFill);
        }
        rectLayer.draw()
    })
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
  