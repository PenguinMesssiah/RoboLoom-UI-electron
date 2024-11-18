const ROW_MAX  = 20
const COL_MAX  = 40
const DEFAULT  = 4
const BUFFER   = 25
const PADDING  = 5;
const WIDTH    = 1600;
const HEIGHT   = 1000;
const FALSE    = 0;
const TRUE     = 1;

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
    width: 1250,
    height: 650,
    draggable: false
});
const rectLayer   = new Konva.Layer({
    id: "rectLayer" 
});
const scrollLayer = new Konva.Layer({
    id: "scrollLayer"
});

const sleep       = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
/* Hex Color Modifier | 4.1
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

//Dynamic Color Properties
let currentWarpMainColor = defaultMainColor
let currentWarpFillColor = defaultFillColor

let currentWeftMainColor = defaultMainColor
let currentWeftFillColor = defaultFillColor

var num_pedals = DEFAULT
var num_shafts = DEFAULT
var select_row     = null
var highlightGroup = null


function initCanvas() {
    drawWeaveDraft(true)
    linkAllEvents()
}

function drawWeaveDraft(resetMatricies) {
    let idx = 0
    
    //Draw Threading & Create Array (s x n)
    var threadingGroup = new Konva.Group({
        x: 5, 
        y: 50,
        id: 'threadingGroup',
        width: 1000,
        height: 250
    });

    for (let i = 0; i < COL_MAX; i++) {
        for (let j = 0; j < num_shafts; j++) {
            createRectangle(idx++, i, j, threadingGroup)
        }
    }
    if(resetMatricies) {
        window.ndarray.createArray(num_shafts, COL_MAX, 0)
    }

    //Draw TieUp & Create Array (s x p)
    var tieUpGroup = new Konva.Group({
        x: 1025, 
        y: 50,
        id: 'tieUpGroup', 
        width: 400,
        height: 400
    });

    for (let i = 0; i < num_pedals; i++) {
        for (let j = 0; j < num_shafts; j++) {
            createRectangle(idx++, i, j, tieUpGroup)
        }
    }
    if(resetMatricies) { 
        window.ndarray.createArray(num_shafts, num_pedals, 1)
    }
    
    //Draw Threadling & Create Array (p x t)
    var treadlingGroup = new Konva.Group({
        x: 1025, 
        y: 50+num_shafts*BUFFER*1.13,
        id: 'treadlingGroup', 
        width: 400,
        height: 600
    });

    for (let i = 0; i < num_pedals; i++) {
        for (let j = 0; j < ROW_MAX; j++) {
            createRectangle(idx++, i, j, treadlingGroup)
        }
    }
    if(resetMatricies) {
        window.ndarray.createArray(ROW_MAX, num_pedals, 2)
    }

    //Draw Drawdown & Create Array  (n x t)
    var drawdownGroup = new Konva.Group({
        x: 5, 
        y: 50+num_shafts*BUFFER*1.13,
        id: 'drawdownGroup', 
        width: 800,
        height: 800
    });

    for (let i = 0; i < COL_MAX; i++) {
        for (let j = 0; j < ROW_MAX; j++) {
            createRectangle(idx++, i, j, drawdownGroup)
        }
    }
    if(resetMatricies) {
        window.ndarray.createArray(ROW_MAX, COL_MAX, 3)
    }

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

    //Draw Weft Color Selector Row
    var weftColorSelectorGroup = new Konva.Group({
        x: 510+num_pedals*BUFFER*1.1, 
        y: 50+num_shafts*BUFFER*1.13,
        id: 'weftColorSelectorGroup', 
        width: 25,
        height: 800
    });

    for (let i = 0; i < ROW_MAX; i++) {
        weftColorPickerRectangle(idx++, 520, i, weftColorSelectorGroup)
    }

    //Mirror Group on Top of Drawdown Group
    highlightGroup = new Konva.Group({
        x: 5, 
        y: 50+num_shafts*BUFFER*1.13,
        id: 'highlightGroup', 
        width: 800,
        height: 800
    });

    drawScrollBars()

    rectLayer.add(threadingGroup);
    rectLayer.add(tieUpGroup);
    rectLayer.add(treadlingGroup);
    rectLayer.add(drawdownGroup);
    rectLayer.add(highlightGroup);
    rectLayer.add(warpColorSelectorGroup);
    rectLayer.add(weftColorSelectorGroup);

    stage.add(rectLayer);
}

function linkAllEvents() {
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
                console.log("Error Handler: Cannot Toggle Drawdown Matrix")
                break;
            
            case 'threadingGroup':
            case 'tieUpGroup':
            case 'treadlingGroup':
                //Decompose Event
                let text_obj = e.target
                let obj_id   = 'rect_' + text_obj.id().toString()
                let cRect    = stage.find("."+obj_id)[0]

                let state = toggleObj(text_obj, cRect)
                updateMatrixElement(cRect, state)
                break;
        }
        //console.log("cRect = ", cRect.getAncestors()[0].id())
        //console.log("printing cRect (", cRect.y()/BUFFER,",",cRect.x()/BUFFER,")")
        rectLayer.draw()
    })

    //Process Drawdown Update
    window.ndarray.onDrawdownUpdate((value) => {
        populateDrawdown(value);       
    })

    window.ndarray.onColorReset((msg) => {
        let threadingTemp   = msg.threading
        let tieUpTemp       = msg.tieUp
        let treadlingTemp   = msg.treadling
        let drawdown_matrix = msg.drawdown
        
        stage.destroyChildren()
        drawWeaveDraft(FALSE)

        populateThreading(threadingTemp);
        populateTieUp(tieUpTemp);
        populateTreadling(treadlingTemp);
        populateDrawdown(drawdown_matrix);
        rectLayer.draw()
    })

    //Load Matricies from Txt File
    window.fs.onLoadFile((value) => {
        let threadingTemp = value.threading
        let tieUpTemp     = value.tieUp
        let treadlingTemp = value.treadling
        
        num_shafts = value.numShaft
        num_pedals = value.numPedal

        stage.destroyChildren()
        resetColors(FALSE)
        drawWeaveDraft(FALSE)
        
        //Load Matricies
        populateThreading(threadingTemp);
        populateTieUp(tieUpTemp);
        populateTreadling(treadlingTemp);
    });

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

    //Link Buttons
    var prevRowBtn = document.getElementById("previousRowBtn")
    var nextRowBtn = document.getElementById("nextRowBtn")
    var jumpRowBtn = document.getElementById("applyRowJump")
    var saveBtn    = document.getElementById('save-btn')
    var calBtn     = document.getElementById('calModeBtn')
    var jacBtn     = document.getElementById('jacquardModeBtn')
    var worldWeave = document.getElementById('worldWeaveBtn')

    var uploadBtn = document.getElementById("uploadFileBtn")
    var fileForm  = document.getElementById("browseFileForm")

    prevRowBtn.addEventListener('click', () => {
        console.log("selec row = ", select_row)
        window.serial.sendRowCmd(select_row)
    })

    nextRowBtn.addEventListener('click', () => {
        console.log("selec row = ", select_row)
        window.serial.sendRowCmd(select_row)
    })

    worldWeave.addEventListener('click', () => {
        window.app.openWorldOfWeaving()
    })

    jumpRowBtn.addEventListener('click', () => {
        //console.log("selec row = ", select_row)
        window.serial.sendRowCmd(select_row)
    })

    saveBtn.addEventListener('click', () => {
        window.fs.saveWeaveDraft(num_shafts, num_pedals)
    })

    uploadBtn.addEventListener('click', () => {
        let file = fileForm.files[0]        
        window.fs.readFile(file.path)
    })

    jacBtn.addEventListener('click', () => {
        window.app.changeView(2,3)
    })

    calBtn.addEventListener('click', () => {
        window.app.changeView(2,1)
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

    var group = pRect.getAncestors()[0].id()
    
    switch(group) {
        case 'tieUpGroup':
            if(value === 0) {
                pText.text('0')
                pText.fill(defaultMainColor)
                pRect.fill(defaultFillColor)
            } else if(value === 1) {
                pText.text('1')
                pText.fill(defaultAltMainColor)
                pRect.fill(defaultAltFillColor)
            }
            break;
        case 'threadingGroup':
        case 'treadlingGroup':
        case 'drawdownGroup':
            if(value === 0 && currentWeftMainColor != defaultMainColor) {
                pText.text('0')
                pText.fill(currentWeftMainColor)
                pRect.fill(currentWeftFillColor)
            } else if(value === 0 && currentWeftMainColor == defaultMainColor) {
                    pText.text('0')
                    pText.fill(defaultMainColor)
                    pRect.fill(defaultFillColor)
            } else if(value === 1 && currentWarpMainColor != defaultMainColor) {
                pText.text('1')
                pText.fill(currentWarpMainColor)
                pRect.fill(currentWarpFillColor)
            } else if(value === 1 && currentWarpMainColor == defaultMainColor) {
                pText.text('1')
                pText.fill(defaultAltMainColor)
                pRect.fill(defaultAltFillColor)
            }
            break;
    }
    
    //Handle Click on Text & Rect

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
        text: '0',
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

//Read & Apply Shaft & Pedal Input
function configShaftsPedals() {
    var shaft_form = document.getElementById('shafts-input')
    var pedal_form = document.getElementById('pedals-input')

    num_shafts = parseInt(shaft_form.value)
    num_pedals = parseInt(pedal_form.value)

    stage.destroyChildren()
    drawWeaveDraft(true)
}

//Highlight Current Row to Weave
function highlightRow(pRow) {
    if(pRow == 1  && (select_row == null || select_row+1 > 19)) {
        select_row = 0
    } else if (pRow == -1 && (select_row == null || select_row-1 < 0)) {
        select_row = 19
    } else if (pRow == 1 && select_row+1 <= 19) {
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

//Functions to Populate Matricies w/ Data
function populateThreading(threadingTemp) {
    var threadingGroupItems = stage.find(node => {
        return node.getAncestors()[0].id() === 'threadingGroup' 
            && node.getClassName() === 'Text'
    });
    threadingGroupItems.forEach((element) => {
        let obj_id   = 'rect_' + element.id().toString()
        let cRect    = stage.find("."+obj_id)[0]
        
        var y = element.getAttr('y')/BUFFER
        var x = element.getAttr('x')/BUFFER
        if(element.text() !== threadingTemp[y][x].toString()){
            //Passing (y,x)
            updateObj(element, cRect, threadingTemp[y][x])
        }
    })
}

function populateTieUp(tieUpTemp) {
    var tieUpGroupItems = stage.find(node => {
        return node.getAncestors()[0].id() === 'tieUpGroup' 
            && node.getClassName() === 'Text'
    });
    tieUpGroupItems.forEach((element) => {
        let obj_id   = 'rect_' + element.id().toString()
        let cRect    = stage.find("."+obj_id)[0]
        
        var y = element.getAttr('y')/BUFFER
        var x = element.getAttr('x')/BUFFER
        if(element.text() !== tieUpTemp[y][x].toString()){
            //Passing (y,x)
            updateObj(element, cRect, tieUpTemp[y][x])
        }
    })
}

function populateTreadling(treadlingTemp) {
    var treadlingGroupItems = stage.find(node => {
        return node.getAncestors()[0].id() === 'treadlingGroup' 
            && node.getClassName() === 'Text'
    });
    treadlingGroupItems.forEach((element) => {
        let obj_id   = 'rect_' + element.id().toString()
        let cRect    = stage.find("."+obj_id)[0]
        
        var y = element.getAttr('y')/BUFFER
        var x = element.getAttr('x')/BUFFER
        if(element.text() !== treadlingTemp[y][x].toString()){
            //Passing (y,x)
            updateObj(element, cRect, treadlingTemp[y][x])
        }
    })
}

function populateDrawdown(drawdownTemp) {
    //Get All Text Obj in DrawdownGroup
    var drawdownGroupItems = stage.find(node => {
        return node.getAncestors()[0].id() === 'drawdownGroup' 
            && node.getClassName() === 'Text'
    });

    drawdownGroupItems.forEach((element) => {
        let obj_id   = 'rect_' + element.id().toString()
        let cRect    = stage.find("."+obj_id)[0]
        
        var y = element.getAttr('y')/BUFFER
        var x = element.getAttr('x')/BUFFER
        if(element.text() !== drawdownTemp[y][x].toString()){
            //Passing (y,x)
            updateObj(element, cRect, drawdownTemp[y][x])
        }
    })  
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

function updateWarpThreads(e) {
    let colorPicker      = document.getElementById("warpColorInputSelector")
    currentWarpMainColor = colorPicker.value
    currentWarpFillColor = pSBC ( 0.2, currentWarpMainColor )
            
    //Decompose Event
    let colorRect_obj = e.target
    colorRect_obj.fill(currentWarpMainColor)
    
    //Update Entire Threading Column
    let totalRectCount = (num_shafts*COL_MAX)+(num_shafts*num_pedals)
                        + (num_pedals*ROW_MAX)+(ROW_MAX*COL_MAX)
    let colorRect_id   = colorRect_obj.id() - totalRectCount
    for(i=0;i<num_shafts;i++) {
        let threading_startRow_id = (colorRect_id * num_shafts) + i
        let tempRect_name = '.' + 'rect_' + threading_startRow_id.toString()
        let tempText_name = '.' + 'text_' + threading_startRow_id.toString()

        let tempRect_obj = rectLayer.findOne(tempRect_name)
        let tempText_obj = rectLayer.findOne(tempText_name)

        if(tempText_obj.text() == '1') {
            tempText_obj.fill(currentWarpMainColor)
            tempRect_obj.fill(currentWarpFillColor)
        }
    }    

    //Update Entire Drawdown Column
    let startRow_id = (num_shafts*COL_MAX)+(num_shafts*num_pedals)
                    + (num_pedals*ROW_MAX)
    for(i=0;i<ROW_MAX;i++) {
        let drawdown_startId = startRow_id+(20*colorRect_id)+i

        let tempRect_name = '.' + 'rect_' + drawdown_startId.toString()
        let tempText_name = '.' + 'text_' + drawdown_startId.toString()

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

    //Update Entire Threading Column
    let totalRectCount = (num_shafts*COL_MAX)+(num_shafts*num_pedals)
                        + (num_pedals*ROW_MAX)+(ROW_MAX*COL_MAX)
                        
    for(i=0;i<num_pedals;i++){
        let threadingTreadlingCount = (num_shafts*COL_MAX)+(num_shafts*num_pedals)
        let delta = (totalRectCount+COL_MAX) - threadingTreadlingCount
        let treadling_rowIndex = (colorRect_obj.id()-delta)+(20*i)

        //console.log("e.id = ", colorRect_obj.id())
        //console.log("delta = ", delta)
        //console.log("treadling_rowIndex = ", treadling_rowIndex)

        let tempRect_name = '.' + 'rect_' + treadling_rowIndex.toString()
        let tempText_name = '.' + 'text_' + treadling_rowIndex.toString()

        let tempRect_obj = rectLayer.findOne(tempRect_name)
        let tempText_obj = rectLayer.findOne(tempText_name)

        if(tempText_obj.text() == '0') {
            tempText_obj.fill(currentWeftMainColor)
            tempRect_obj.fill(currentWeftFillColor)
        }
    }

    //Update Entire Drawdown Column
    let startRow_id = (num_shafts*COL_MAX)+(num_shafts*num_pedals)
                        + (num_pedals*ROW_MAX)
    for(i=0;i<COL_MAX;i++) {
        let drawdown_startRow_id = colorRect_obj.id()-(totalRectCount+COL_MAX)
        drawdown_startRow_id = startRow_id + drawdown_startRow_id + 20*i

        let tempRect_name = '.' + 'rect_' + drawdown_startRow_id.toString()
        let tempText_name = '.' + 'text_' + drawdown_startRow_id.toString()

        let tempRect_obj = rectLayer.findOne(tempRect_name)
        let tempText_obj = rectLayer.findOne(tempText_name)

        if(tempText_obj.text() == '0') {
            tempText_obj.fill(currentWeftMainColor)
            tempRect_obj.fill(currentWeftFillColor)
        }
    }
}

//Draw Scroll Bars
function drawScrollBars() {
    stage.add(scrollLayer);

    var verticalBar = new Konva.Rect({
        width: 10,
        height: 100,
        id: 'verticalBar',
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
    scrollLayer.add(verticalBar);

    var horizontalBar = new Konva.Rect({
        width: 100,
        height: 10,
        id: 'horizontalBar',
        fill: 'grey',
        opacity: 0.8,
        x: PADDING,
        y: stage.height() - PADDING - 10,
        draggable: true,
        dragBoundFunc: function (pos) {
            pos.x = Math.max(
            Math.min(pos.x, stage.width() - this.width() - PADDING),PADDING);
            pos.y = stage.height() - PADDING - 10;
            return pos;
        },
    });

    scrollLayer.add(horizontalBar);

    horizontalBar.on('dragmove', function () {
    // delta in %
    const availableWidth =
        stage.width() - PADDING * 2 - horizontalBar.width();
    var delta = (horizontalBar.x() - PADDING) / availableWidth;

    rectLayer.x(-(WIDTH - stage.width()) * delta);
    });

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

        const availableWidth =
          stage.width() - PADDING * 2 - horizontalBar.width();

        const hx =
          (rectLayer.x() / (-WIDTH + stage.width())) * availableWidth + PADDING;
        horizontalBar.x(hx);
      });
}

function resetColors(redrawDrawdown){
    currentWarpMainColor = defaultMainColor
    currentWarpFillColor = defaultFillColor
    currentWeftMainColor = defaultMainColor
    currentWeftFillColor = defaultFillColor

    //Envoke Call to 'reset-colors'
    if(redrawDrawdown) { window.ndarray.resetColors()}
}

function sendPlainWeave(pStartValue) {
    window.serial.sendPlainWeave(pStartValue)
}

//Execute
initCanvas()