const ROW_MAX  = 32
const COL_MAX  = 40
const BUFFER   = 25
const PADDING  = 5;
const WIDTH    = 1100;
const HEIGHT   = 825;
const TRUE     = 1
const FALSE    = 0

/*
    Konva is in (c,r) format by default
    where (y,x) represent the horizontal & vertical axis respectively 
*/
const stage = new Konva.Stage({
    container: 'konva-container',
    width: 1100,
    height: 600,
    draggable: false
});
const rectLayer   = new Konva.Layer();

const cmain       = 'black'
const cmainFill   = 'white'
const calternate  = 'blue'
const calternativeFill = '#0080FF'
const cgreen      = 'green'

let select_row     = null
let highlightGroup = null

function initCanvas() {
    //stage.container().style.backgroundColor = 'green';
    drawWeaveDraft(TRUE)
    linkEvents()
}

function drawWeaveDraft(makeNewMatrix) {
    let idx = 0
    
    //Draw Drawdown & Create Array  (n x t)
    var drawdownGroup = new Konva.Group({
        x: 5, 
        y: 5,
        id: 'drawdownGroup', 
        width: 800,
        height: 800
    });

    for (let i = 0; i < COL_MAX; i++) {
        for (let j = 0; j < ROW_MAX; j++) {
            createRectangle(idx++, i, j, drawdownGroup)
        }
    }
    if(makeNewMatrix){
        window.ndarray.createArray(ROW_MAX, COL_MAX, 3)
    }
    
    //Mirror Group on Top of Drawdown Group
    highlightGroup = new Konva.Group({
        x: 5, 
        y: 5,
        id: 'highlightGroup', 
        width: 800,
        height: 800
    });

    drawScrollBars()

    rectLayer.add(drawdownGroup);
    rectLayer.add(highlightGroup);
    stage.add(rectLayer);
}

//Link Canvas Events
function linkEvents() {
    var uploadBtn = document.getElementById("uploadFileBtn")
    var fileForm  = document.getElementById("browseFileForm")
    
    var prevRowBtn = document.getElementById("previousRowBtn")
    var nextRowBtn = document.getElementById("nextRowBtn")

    prevRowBtn.addEventListener('click', () => {
        console.log("selec row = ", select_row)
        window.serial.sendRowCmd(select_row)
    })

    nextRowBtn.addEventListener('click', () => {
        console.log("selec row = ", select_row)
        window.serial.sendRowCmd(select_row)
    })

    uploadBtn.addEventListener('click', () => {
        let file = fileForm.files[0]        
        window.jquery.readFile(file.path)
    })

    //Update Drawdown
    window.ndarray.onDrawdownUpdate((message) => {
        //Clear Canvas
        stage.destroyChildren()
        drawWeaveDraft(FALSE)

        //Decompose Message
        let value = message.drawdown_matrix
        let row   = message.row
        let col   = message.col

        //TODO: Find Better Solution Than Truncating
        if(row >= ROW_MAX) { row = ROW_MAX }
        if(col >= COL_MAX) { col = COL_MAX }
        
        for (let i = 0; i < col; i++) {
            for (let j = 0; j < row; j++) {
                /* Get Rect & Text Obj by (y,x) Position
                *  Returns Array[2] where Arr[0] = Rect, Arr[1] = Text
                */
                let vObjects = stage.find(node => {
                    return (node.getClassName() === 'Text' || node.getClassName() === 'Rect')
                        && node.getAttr('x')/BUFFER === i
                        && node.getAttr('y')/BUFFER === j 
                });
        
                let vRect = vObjects[0]
                let vText = vObjects[1]
                //console.log("Looking at position ", i,", " ,j)
                //console.log("updating vText, vRect, with ", vRect, vText, value[j][i])
                updateObj(vText, vRect, value[j][i])
            }
        }     
    })
}

//Manual Config Rect & Text Obj
function updateObj(pText, pRect, value) {
    //pText.text(value.toString())
    if(pText.text() === value){
        return
    }

    //Handle Click on Text & Rect
    if(value === '0') {
        pText.text('0')
        pText.fill(cmain)
        pRect.fill(cmainFill)
    } else if(value === '1') {
        pText.text('1')
        pText.fill(calternate)
        pRect.fill(calternativeFill)
    }

    rectLayer.draw()
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

//Highlight Current Row to Weave
function highlightRow(pRow) {
    if(pRow == 1  && (select_row == null || select_row+1 > 29)) {
        select_row = 0
    } else if (pRow == -1 && (select_row == null || select_row-1 < 0)) {
        select_row = 29
    } else if (pRow == 1 && select_row+1 <= 29) {
        select_row++;
    } else if (pRow == -1 && select_row-1 >= 0) {
        select_row--;
    } else if (pRow == 0) {
        var row_form = document.getElementById('row-select-input')
        //console.log("blank entry", parseInt(row_form.value))
        select_row   = parseInt(row_form.value)
    }

    highlightGroup.destroyChildren()

    rect = new Konva.Rect({
        width: 25*COL_MAX,
        height: 25,
        cornerRadius: 1,
        x: 0*BUFFER,
        y: select_row*BUFFER,
        stroke: 'blue',
        strokeWidth: 3,
        zindex: 15
    })

    highlightGroup.add(rect)
}

function drawScrollBars() {
    var scrollLayers = new Konva.Layer();
    stage.add(scrollLayers);

    var verticalBar = new Konva.Rect({
        width: 10,
        height: 100,
        fill: 'grey',
        opacity: 0.8,
        x: stage.width() - PADDING - 10,
        y: PADDING,
        draggable: true,
        dragBoundFunc: function (pos) {
            pos.x = stage.width() - PADDING - 10;
            pos.y = Math.max(
            Math.min(pos.y, stage.height() - this.height() - PADDING),PADDING);
            return pos;
        },
    });

    verticalBar.on('dragmove', function () {
        // delta in %
        const availableHeight =
            stage.height() - PADDING * 2 - verticalBar.height();
        var delta = (verticalBar.y() - PADDING) / availableHeight;

        rectLayer.y(-(HEIGHT - stage.height()) * delta);
    });
    scrollLayers.add(verticalBar);

    stage.on('wheel', function (e) {
        // prevent parent scrolling
        e.evt.preventDefault();
        const dx = e.evt.deltaX;
        const dy = e.evt.deltaY;

        const minX = -(WIDTH - stage.width());
        const maxX = 0;

        const x = Math.max(minX, Math.min(rectLayer.x() - dx, maxX));

        const minY = -(HEIGHT - stage.height());
        const maxY = 0;

        const y = Math.max(minY, Math.min(rectLayer.y() - dy, maxY));
        rectLayer.position({ x, y });

        const availableHeight =
          stage.height() - PADDING * 2 - verticalBar.height();
        const vy =
          (rectLayer.y() / (-HEIGHT + stage.height())) * availableHeight + PADDING;
        verticalBar.y(vy);
      });
}

//Execute
initCanvas()