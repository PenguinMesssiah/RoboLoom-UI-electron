const ROW_MAX  = 32
const COL_MAX  = 40
const BUFFER   = 25
const PADDING  = 5;
const WIDTH    = 1100;
const HEIGHT   = 825;
const TRUE     = 1
const FALSE    = 0

const defaultMainColor    = 'black'
const defaultFillColor    = 'white'
const defaultAltMainColor = 'blue'
const defaultAltFillColor = '#0080FF'

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

const sleep       = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
/*Hex Color Modifier | 4.1
PimpTrizkit, PJs: Shade, Blend, and Convert a Web Color, (2021), GitHub repository, https://github.com/PimpTrizkit/PJs.wiki.git
*/
const pSBC=(p,c0,c1,l)=>{
	let r,g,b,P,f,t,h,m=Math.round,a=typeof(c1)=="string";
	if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
	h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBC.pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBC.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
	if(!f||!t)return null;
	if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
	else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
	a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
	if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
	else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}
pSBC.pSBCr=(d)=>{
	const i=parseInt;
	let n=d.length,x={};
	if(n>9){
		const [r, g, b, a] = (d = d.split(','));
	        n = d.length;
		if(n<3||n>4)return null;
		x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
	}else{
		if(n==8||n==6||n<4)return null;
		if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
		d=i(d.slice(1),16);
		if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=Math.round((d&255)/0.255)/1000;
		else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
	}return x
};

//Dynamic Properties
let select_row     = null
let highlightGroup = null
let activeRow      = ROW_MAX-1
let activeCol      = COL_MAX

//Dynamic Color Properties
let currentWarpMainColor = defaultMainColor
let currentWarpFillColor = defaultFillColor

let currentWeftMainColor = defaultMainColor
let currentWeftFillColor = defaultFillColor

function initCanvas() {
    drawWeaveDraft(TRUE)
    linkEvents()
}

function drawWeaveDraft(makeNewMatrix) {
    let idx = 0
    
    //Draw Warp Color Selector Row
    var warpColorSelectorGroup = new Konva.Group({
        x: 5, 
        y: 5,
        id: 'warpColorSelectorGroup', 
        width: 800,
        height: 25
    });

    for (let i = 0; i < COL_MAX; i++) {
        warpColorPickerRectangle(idx++, i, 5, warpColorSelectorGroup)
    }

    //Draw Drawdown & Create Array  (n x t)
    var drawdownGroup = new Konva.Group({
        x: 5, 
        y: 50,
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
        y: 50,
        id: 'highlightGroup', 
        width: 800,
        height: 800
    });

    //Draw Weft Color Selector Row
    var weftColorSelectorGroup = new Konva.Group({
        x: 520, 
        y: 50,
        id: 'weftColorSelectorGroup', 
        width: 25,
        height: 800
    });

    for (let i = 0; i < ROW_MAX; i++) {
        weftColorPickerRectangle(idx++, 520, i, weftColorSelectorGroup)
    }

    drawScrollBars()

    rectLayer.add(warpColorSelectorGroup);
    rectLayer.add(drawdownGroup);
    rectLayer.add(highlightGroup);
    rectLayer.add(weftColorSelectorGroup);
    stage.add(rectLayer);
}

//Link Canvas Events
function linkEvents() {
    var uploadBtn = document.getElementById("uploadFileBtn")
    var fileForm  = document.getElementById("browseFileForm")
    
    var prevRowBtn = document.getElementById("previousRowBtn")
    var nextRowBtn = document.getElementById("nextRowBtn")
    var jumpRowBtn = document.getElementById("applyRowJump")
    var calBtn     = document.getElementById('calModeBtn')
    var shaftBtn   = document.getElementById('shaftModeBtn')
    var worldWeave = document.getElementById('worldWeaveBtn')
    var totalRow   = document.getElementById('availableRows')
    var row_form   = document.getElementById('row-select-input')

    prevRowBtn.addEventListener('click', () => {
        //console.log("selec row = ", select_row)
        window.serial.sendRowCmd(select_row)
        updateCommandHistory(select_row, 0)
    })

    nextRowBtn.addEventListener('click', () => {
        //console.log("selec row = ", select_row)
        window.serial.sendRowCmd(select_row)
        updateCommandHistory(select_row, 0)
    })

    jumpRowBtn.addEventListener('click', () => {
        //console.log("selec row = ", select_row)
        if(parseInt(row_form.value) > activeRow) {
            console.log("Error: Invalid Row Selected for Jump Command | Input Row ", parseInt(row_form.value), " Maximum of ", activeRow, "available rows.")
            return
        } else if (parseInt(row_form.value) < 0) {
            console.log("Error: Invalid Row Selected for Jump Command | Input Row ", parseInt(row_form.value), ", Rows start at index 0.")
            return  
        }
        window.serial.sendRowCmd(select_row)
        updateCommandHistory(select_row, 0)
    })

    worldWeave.addEventListener('click', () => {
        window.app.openWorldOfWeaving()
    })

    uploadBtn.addEventListener('click', () => {
        let file = fileForm.files[0]        
        window.jquery.readFile(file.path)
    })

    shaftBtn.addEventListener('click', () => {
        window.app.changeView(3,2)
    })

    calBtn.addEventListener('click', () => {
        window.app.changeView(3,1)
    })

    //Update Drawdown
    window.ndarray.onDrawdownUpdate((message) => {
        //Clear Canvas
        stage.destroyChildren()
        resetColors(FALSE)
        drawWeaveDraft(FALSE)

        //Decompose Message
        let value = message.drawdown_matrix
        activeRow = message.row - 1;
        activeCol = message.col

        //TODO: Find Better Solution Than Truncating
        if(activeRow >= ROW_MAX) { activeRow = ROW_MAX-1 }
        if(activeCol >= COL_MAX) { activeCol = COL_MAX }

        //Lock JumpToRow Input
        totalRow.innerText = "Total Number of Rows = " + activeRow
        row_form.max       = activeRow
        
        for (let i = 0; i < activeCol; i++) {
            for (let j = 0; j < activeRow; j++) {
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
    
    window.serial.onSerialDisconnect(() => {
        let serialModal      = document.getElementById('serialDisconnectModal')
        let serialModalBody  = document.getElementById("serial-modal-body")
        let serialModalTitle = document.getElementById("staticBackdropLabel")
        let serialModalImg   = document.getElementById("modal-img")
        let backdrop         = document.getElementById("backdrop")

        serialModalTitle.innerText = "Warning: Arduino Disconnected"
        serialModalImg.src         = "./assets/svg/bi-exclimation-triangle.svg"
        serialModalBody.innerText = "Uh oh! Your arduino has been disconnected; Please reconnect your loom to this PC to continue."
        backdrop.style.display    = "block"
        serialModal.style.display = "block"
        serialModal.classList.add("show")
    })

    window.serial.onSerialReconnect(() => {
        let serialModal      = document.getElementById('serialDisconnectModal')
        let serialModalBody  = document.getElementById("serial-modal-body")
        let serialModalTitle = document.getElementById("staticBackdropLabel")
        let serialModalImg   = document.getElementById("modal-img")
        let backdrop         = document.getElementById("backdrop")
       
        let updateAction = async () => {
            serialModalTitle.innerText = "Resolved: Serial Connection"
            serialModalBody.innerText  = "Success! Arduino Connection Re-Established; Happy Weaving!"
            serialModalImg.src         = "./assets/svg/SoloPersonaje.png"
            await sleep(1750)
            backdrop.style.display    = "none"
            serialModal.style.display = "none"
            serialModal.classList.remove("show")
        }

        updateAction();
    })
    
    stage.on('click', function (e) {
        //Error Handling
        if(typeof e.target.id() == 'string') {
            console.log("Error Handler: Clicked on Invalid Canvas Location")
            return
        }

        let groupId = e.target.getAncestors()[0].id()

        switch(groupId) {
            case 'warpColorSelectorGroup':
                updateWarpThreads(e); 
                break;

            case 'weftColorSelectorGroup':
                updateWeftThreads(e);
                break;

            case 'drawdownGroup':
                //Decompose Event
                let text_obj = e.target
                let obj_id   = 'rect_' + text_obj.id().toString()
                let cRect    = stage.find("."+obj_id)[0]
                //Perform Update
                let state = toggleObj(text_obj, cRect)
                updateMatrixElement(cRect, state)
                break;
        }

        rectLayer.draw()
    })
}

function updateMatrixElement(pRect, pState) {
    var row   = pRect.y()/BUFFER
    var col   = pRect.x()/BUFFER
    //Only Ever Updating Drawdown from Jaquard Window    
    window.ndarray.updateMatrix(row, col, pState, 3)
}

//Toggle Rect & Text Obj
function toggleObj(pText, pRect) {
    var bool = null

    //Handle Click on Text
    if(pText.text() == '0' && currentWarpMainColor != defaultMainColor) {
        bool = 1
        pText.text('1')
        pText.fill(currentWarpMainColor)
        pRect.fill(currentWarpFillColor)
    } else if(pText.text() == '0' && currentWarpMainColor == defaultMainColor) {
        bool = 1
        pText.text('1')
        pText.fill(defaultAltMainColor)
        pRect.fill(defaultAltFillColor)
    } else if(pText.text() == '1' && currentWeftMainColor != defaultMainColor) {
        bool = 0
        pText.text('0')
        pText.fill(currentWeftMainColor)
        pRect.fill(currentWeftFillColor);
    } else if (pText.text() == '1' && currentWeftMainColor == defaultMainColor) {
        bool = 0
        pText.text('0')
        pText.fill(defaultMainColor)
        pRect.fill(defaultFillColor);
    }

    return bool
}

//Manual Config Rect & Text Obj
function updateObj(pText, pRect, value) {
    if(pText.text() === value){
        return
    }

    //Handle Click on Text & Rect
    if(value === '0') {
        pText.text('0')
        pText.fill(defaultFillColor)
        pRect.fill(defaultMainColor)
    } else if(value === '1') {
        pText.text('1')
        pText.fill(defaultAltMainColor)
        pRect.fill(defaultAltFillColor)
    }

    rectLayer.draw()
}

//Create Rectangle with Label
function createRectangle(i, x, y, group) {
    var name = "rect_" + i.toString()
    var text_name = "text_" + i.toString()
    
    rect = new Konva.Rect({
        width: 25,
        height: 25,
        name: name,
        cornerRadius: 1,
        x: x*BUFFER,
        y: y*BUFFER,
        fill: currentWeftFillColor,
        stroke: currentWeftMainColor,
        strokeWidth: 1,
        zindex: 0
    })
    
    label = new Konva.Text({
        text:'0',
        id: i,
        name: text_name,
        x: x*BUFFER,
        y: y*BUFFER,
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: currentWeftMainColor,
        width: 25,
        padding: 5,
        align: 'center',
        zindex: 10
    })

    group.add(rect)
    group.add(label)
}

function warpColorPickerRectangle(i, x, y, group) {
    var name = "rect_" + i.toString()
    
    rect = new Konva.Rect({
        width: 25,
        height: 25,
        id: i,
        name: name,
        cornerRadius: 1,
        x: x*BUFFER,
        y: y,
        fill: defaultFillColor,
        stroke: defaultMainColor,
        strokeWidth: 1,
        zindex: 0
    })

    group.add(rect)
}

function weftColorPickerRectangle(i, x, y, group) {
    var name = "rect_" + i.toString()
    
    rect = new Konva.Rect({
        width: 25,
        height: 25,
        id: i,
        name: name,
        cornerRadius: 1,
        x: x,
        y: y*BUFFER,
        fill: defaultFillColor,
        stroke: defaultMainColor,
        strokeWidth: 1,
        zindex: 0
    })

    group.add(rect)
}

//Highlight Current Row to Weave
function highlightRow(pRow) {
    if(pRow == 1  && (select_row == null || select_row+1 > activeRow)) {
        select_row = 0
    } else if (pRow == -1 && (select_row == null || select_row-1 < 0)) {
        select_row = activeRow
    } else if (pRow == 1 && select_row+1 <= activeRow) {
        select_row++;
    } else if (pRow == -1 && select_row-1 >= 0) {
        select_row--;
    } else if (pRow == 0) {
        var row_form = document.getElementById('row-select-input')
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

function updateWarpThreads(e) {
    let colorPicker      = document.getElementById("warpColorInputSelector")
    currentWarpMainColor = colorPicker.value
    currentWarpFillColor = pSBC ( 0.2, currentWarpMainColor )
            
    //Decompose Event
    let colorRect_obj = e.target
    colorRect_obj.fill(currentWarpMainColor)
    

    //Update Entire Column
    for(i=0; i< ROW_MAX; i++){
        let colorRect_id  = colorRect_obj.id()
        let startRow_id   = (40+32*colorRect_id)+i
        let tempRect_name = '.' + 'rect_' + startRow_id.toString()
        let tempText_name = '.' + 'text_' + startRow_id.toString()

        let tempRect_obj = rectLayer.findOne(tempRect_name)
        let tempText_obj = rectLayer.findOne(tempText_name)
        
        if(tempText_obj.text() == '1') {
            tempText_obj.fill(currentWarpMainColor)
            tempRect_obj.fill(currentWarpFillColor)
        }
    }
}

function updateWeftThreads(e) {
    let colorPicker      = document.getElementById("weftColorInputSelector")
    currentWeftMainColor = colorPicker.value
    currentWeftFillColor = pSBC ( 0.2, currentWeftMainColor )
            
    //Decompose Event
    let colorRect_obj = e.target
    colorRect_obj.fill(currentWeftMainColor)
    
    //Update Entire Row
    for(i=0; i< COL_MAX; i++){
        let colorRect_id  = colorRect_obj.id()-1320
        let startRow_id   = colorRect_id+40+(32*i)
        
        let tempRect_name = '.' + 'rect_' + startRow_id.toString()
        let tempText_name = '.' + 'text_' + startRow_id.toString()

        let tempRect_obj = rectLayer.findOne(tempRect_name)
        let tempText_obj = rectLayer.findOne(tempText_name)
        
        if(tempText_obj.text() == '0') {
            tempText_obj.fill(currentWeftMainColor)
            tempRect_obj.fill(currentWeftFillColor)
        }
    }
}

function resetColors(redrawDrawdown){
    currentWarpMainColor = defaultMainColor
    currentWarpFillColor = defaultFillColor
    currentWeftMainColor = defaultMainColor
    currentWeftFillColor = defaultFillColor

    //Envoke Call to 'drawdown-update'
    if(redrawDrawdown) { window.ndarray.envokeDrawdownUpdate()}
}

function updateCommandHistory(pSelectedRow, pCommandSource) {
    let date_obj = new Date()
    let historyItem1 = document.getElementById("historyItem1")
    let historyItem2 = document.getElementById("historyItem2")
    let historyItem3 = document.getElementById("historyItem3")

    let newCommand = date_obj.getHours() + ":" +
                        date_obj.getMinutes() + ":" + 
                        date_obj.getSeconds() + " | ";
    switch(pCommandSource) {
        case 0:
            newCommand += "\nRow: " + pSelectedRow
            break;
        case 1:
            newCommand += "\nOvershot: "
            switch(pSelectedRow) {
                case 0:
                    newCommand += "0101"
                    break;
                case 1:
                    newCommand += "1010"
                    break;
                case -1:
                    newCommand += "0000"
                    break;
            }
            break;
        }

    //Update Command Log 
    historyItem3.innerHTML = historyItem2.innerHTML
    historyItem2.innerHTML = historyItem1.innerHTML
    historyItem1.innerHTML = newCommand
}

function sendPlainWeave(pStartValue) {
    window.serial.sendPlainWeave(pStartValue)
    updateCommandHistory(pStartValue, 1)
}

//Execute
initCanvas()