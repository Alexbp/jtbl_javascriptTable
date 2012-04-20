/*
 * jtbl (javascriptTable)
 *
 * AUTHOR: Alexandre Barrera Pintor
 * DATE: 20/04/2012
 * This work is licensed under the Creative Commons Attribution 3.0 Unported License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by/3.0/
 * or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
 *
 */

(function(window){
    jtbl = function()
    {
        var that = this;
        this.VERSION = "01.12.0420";
        
        /* ** PROPERTIES PRIVATE ************************************************************************************ */
        
        this.idTable = "";
        
        this.srchField = "0";
        this.srchOrder = "0";
        
        this.spl = null;
        this.spl_rx = false;
        this.spl_cx = 0;
        this.spl_cy = 0;
        this.spl_cxi = 0;
        this.spl_cxf = 0;
        this.spl_cn = 0;
        this.spl_lx = 0;
        
        this.cssErr = 0;
        this.cssSty = 0;
        
        this.fontSize = 12;
        
        this.tcolorBackground = "#FFF";
        this.tcolorBorder = "#BBB";
        this.tcolorTdSelect = "#CCC";
        this.tcolorTdChange = "#BBE";
        this.tcolorHeader = "#DDD";
        this.tcolorAdded = "#CC8";
        this.tcolorSep = "#88C";
        this.tcolorSepLine = "#009";
        
        this.style = "";
        this.styleTr = "";
        this.styleTd = "";
        this.styleHeader = "";
        this.styleAddRowt = "";
        this.styleAddRowcfs = "";
        this.styleHeaderSep = "";
        this.styleHeaderBorder = "";
        this.styleCellClick = "";
        this.styleSlp = "";
        
        /* ** PROPERTIES PUBLIC ************************************************************************************* */
        
        this.blqFirstCol = false; // Blocks the first column.
        this.resizeCol = false; // Enables column resize.
        this.colsWidth = null; // Array column width size.
        
        /* ** DECLARE PRIVATE FUNCTIONS ***************************************************************************** */
        
        this.addStyles = function() { };
        this.addEventsCells = function() { };
        this.addWidthCols = function() { };
        this.addRows = function() { };
        this.addHeader = function() { };
        this.addSpl = function() { };
        
        /* ** DECLARE PUBLIC FUNCTIONS OVERLOAD ********************************************************************* */
        
        // Function click in header. Returns column position and order.
        this.tableHeader_click = function(pos, order){};
        
        // Function click in blocked cell. Returns entire Row.
        this.tableRow_click = function(tr){};
        
        // Function click in cell. Returns input of selected cell.
        this.tableField_click = function(input){};
        
        // Function at the modify cell. Returns input object and old value.
        this.tableField_change = function(inp, oldValue){};
        
        // Function add. Returns entire Row.
        this.tableField_add = function(tr){};
        
        /* ** PUBLIC FUNCTIONS ************************************************************************************** */
        
        this.load = function(id)
        {
            if(ge(id))
            {
                that.idTable = id;
                setTimeout(function(){iniObj();},10);
            }
        }
        
        function iniObj()
        {
            createDivs();
            
            setStyles();
            setFunctions();
            
            that.addStyles();
            
            if(that.cssSty == 1) that.resizeCol = false;
            if(that.resizeCol)
            {
                addEvent(window.document.body, "mousemove", function(event){ return _jtbl_getMouseXY(event); });
                addEvent(window.document.body, "mouseup", function(event){ return _jtbl_release(event); });
            }
            
            setTimeout(function(){that.addEventsCells();},10);
            setTimeout(function(){that.addWidthCols();},10);
            setTimeout(function(){that.addRows();},10);
            setTimeout(function(){that.addHeader();},10);
            setTimeout(function(){that.addSpl();},10);
        }
        
        this.setRow = function(tr)
        {
            try
            {
                ge(that.idTable).appendChild(tr);
                tr.scrollIntoView(false);
                
                var tblAdd = ge(that.idTable + "_jtbl_tAddRow");
                var tr = tblAdd.rows[0];
                for(var i = 0; i < tr.cells.length; i++)
                {
                    if(tr.cells[i].firstChild && tr.cells[i].firstChild.nodeName.toUpperCase() == "INPUT")
                        tr.cells[i].firstChild.value = "";
                }
            }catch(err){ console.error("#Error jtbl> setRow: " + err); }
        }
        
        /* ** PRIVATE FUNCTIONS ************************************************************************************* */
        
        function createDivs()
        {
            var dpn = ge(that.idTable).parentNode;
            
            var dElem0 = document.createElement("div");
            // HEADER
            dElem0.id = that.idTable + "_jtbl_0";
            dpn.appendChild(dElem0);
            var dElem1 = document.createElement("div");
            // MAIN
            dElem1.id = that.idTable + "_jtbl_1";
            dElem1.style.backgroundColor = that.tcolorHeader;
            dElem1.style.height = ((dpn.clientHeight-50)+"px");
            dElem1.style.overflow = "auto";
            dElem1.style.overflowX = "hidden";
            dElem1.style.overflowY = "auto";
            dpn.appendChild(dElem1);
            var dElem2 = document.createElement("div");
            // FOOTER
            dElem2.id = that.idTable + "_jtbl_2";
            dpn.appendChild(dElem2);
            
            dElem1.appendChild(ge(that.idTable));
            
            var fnc = window.onresize;
            window.onresize = function()
            {
                if(fnc!=null) fnc();
                var dTbl = ge(that.idTable).parentNode;
                var dp = dTbl.parentNode;
                dTbl.style.height = ((dp.clientHeight-60)+"px");
            }
        }
        
        function setStyles()
        {
            if(that.style == "")
                that.style = "width:99.9%; border:solid 0 #000; border-collapse:collapse; cursor:pointer; " +
                    "font-size:" + (that.fontSize-1) + "px; background-color:" + that.tcolorBackground + ";";
            if(that.styleTr == "") that.styleTr = "";
            if(that.styleTd == "")
                that.styleTd = "border:solid 1px " + that.tcolorBorder + ";";
            if(that.styleHeader == "")
                that.styleHeader = "width:99.9%; border-collapse:collapse; overflow:hidden; white-space:nowrap; " +
                    "vertical-align:bottom; font-weight:bold; border-bottom:solid 1px #000; border-right:solid 1px #000; " +
                    "font-size:" + (that.fontSize) + "px; background-color:" + that.tcolorHeader + ";";
            if(that.styleAddRowt == "")
                that.styleAddRowt = "width:99.9%; border-collapse:collapse; overflow:hidden; white-space:nowrap; " +
                    "font-size:" + (that.fontSize-2) + "px; background-color:" + that.tcolorBackground + ";";
            if(that.styleAddRowcfs == "")
                that.styleAddRowcfs = (that.fontSize-2) + "px";
            if(that.styleHeaderSep == "")
                that.styleHeaderSep = "float:left; display:inline; position:relative; left:-3px; height:98%; width:3px; " +
                    "background-color:" + that.tcolorBorder + ";";
            if(that.styleHeaderBorder == "")
                that.styleHeaderBorder = "solid 1px " + that.tcolorBorder + "";
            if(that.styleCellClick == "")
                that.styleCellClick = "border:solid 0 #000; background-color:" + that.tcolorTdSelect + "; font-size:" + (that.fontSize-2) + "px;";
            if(that.styleSlp == "")
                that.styleSlp = "position:absolute; display:none; top:0; left:0; height:0; width:2px; border-left:dashed 2px " + that.tcolorSepLine + ";";
        }
        
        function setFunctions()
        {
            that.addStyles = function() { addStylesTable(); };
            that.addEventsCells = function() { setTimeout(addEventsCellsTable,10); };
            that.addWidthCols = function() { addWidthColsTable(); };
            that.addRows = function() { addRowsTable(); };
            that.addHeader = function() { addHeaderTable(); };
            that.addSpl = function() { addSplTable(); };
        }
        
        function addStylesTable()
        {
            try
            {
                if(that.style != "") ge(that.idTable).className = createCssClass(that.idTable + "_jtbl_tLines_class", that.style);
                if(that.styleTr != "") createCssClass(that.idTable + "_jtbl_tLines_class tr", that.styleTr);
                if(that.styleTd != "") createCssClass(that.idTable + "_jtbl_tLines_class td", that.styleTd);
            }catch(err){ console.error("#Error jtbl> addStylesTable: " + err); }
        }
        
        function addWidthColsTable()
        {
            try
            {
                var tblLines = ge(that.idTable);
                for(var i = 0; i < tblLines.rows[0].cells.length; i++)
                {
                    var wwc = tblLines.rows[0].cells[i].clientWidth;
                    if(that.colsWidth && that.colsWidth[i] && (i+1 < tblLines.rows[0].cells.length)){
                        if(that.blqFirstCol){
                            if(i == 0)
                                tblLines.rows[0].cells[i].style.width = tblLines.rows[0].cells[i].clientWidth + "px";
                            else
                                tblLines.rows[0].cells[i].style.width = that.colsWidth[i-1] + "px";
                        }
                        else
                            tblLines.rows[0].cells[i].style.width = that.colsWidth[i] + "px";
                    }
                }
            }
            catch(err){ }
        }
        
        function addHeaderTable()
        {
            try
            {
                var tblLines = ge(that.idTable);
                var tElem = null, trElem = null, tdElem = null;
                
                if(ge(that.idTable + "_jtbl_tLinesHeader") == undefined)
                {
                    tElem = document.createElement("table");
                    tElem.id = that.idTable + "_jtbl_tLinesHeader";
                    tElem.className = createCssClass(tElem.id + "_class", that.styleHeader);
                    tElem.style.cursor = "pointer";
                    tElem.style.height = (tblLines.rows[0].cells[0].clientHeight + "px");
                    tElem.style.width = (tblLines.clientWidth + "px");
                    
                    ge(that.idTable + "_jtbl_0").appendChild(tElem);
                    
                    trElem = tElem.insertRow(0);
                    
                    for(var i = 0; i < tblLines.rows[0].cells.length; i++)
                    {
                        tdElem = trElem.insertCell(i);
                        tdElem.style.border = that.styleHeaderBorder;
                        tdElem.style.width = ((tblLines.rows[0].cells[i].clientWidth - 3) + "px");
                        if(i==0) tblLines.rows[0].cells[i].style.height = ((tblLines.rows[0].cells[i].clientHeight + 6) + "px");
                        
                        var hc = (tblLines.rows[0].cells[i].clientHeight - 2);
                        if(hc < 0) hc = 0;
                        tdElem.style.height = (hc + "px");
                        tdElem.innerHTML = "";
                        
                        var cssName = that.idTable + "_jtbl_tLinesHeaderSep_class";
                        if(getCss(cssName) == "") createCssClass(cssName, that.styleHeaderSep);
                        var newObj = document.createElement("div");
                        newObj.className = cssName;
                        newObj.innerHTML = "<span>&nbsp;</span>";
                        if(i == 0) newObj.style.backgroundColor = "Transparent";
                        tdElem.appendChild(newObj);
                        
                        if(that.cssSty==1) tdElem.style.fontSize = (that.fontSize-2)+"px";
                        
                        tdElem.innerHTML += tblLines.rows[0].cells[i].innerHTML;
                        
                        addEvent(tdElem, "click", function(){ _tableHeader_click(this.cellIndex); });
                        if(that.resizeCol && tdElem.firstChild && tdElem.firstChild.nodeName == "DIV")
                        {
                            if((i > 1 && that.blqFirstCol)||(i > 0 && !that.blqFirstCol))
                            {
                                var divSep = tdElem.firstChild;
                                
                                addEvent(divSep, "mouseover", function(){ _cellHeaderResize_mouseover(this); });
                                addEvent(divSep, "mouseout", function(){ _cellHeaderResize_onmouseout(this); });
                                addEvent(divSep, "mousedown", function(event){ _cellHeaderResize_onmousedown(event, this.parentNode.cellIndex); });
                            }
                        }
                    }
                    tblLines.deleteRow(0);
                }
                resizeTable();
            }catch(err){ console.error("#Error jtbl> addHeaderTable: " + err); }
        }
        
        function resizeTable()
        {
            try
            {
                var tblHeader = ge(that.idTable + "_jtbl_tLinesHeader");
                var tblLines = ge(that.idTable);
                
                if(tblLines.rows[0].cells.length != tblHeader.rows[0].cells.length)
                    throw "Los campos de cabecera y tabla no coinciden!";
                
                for(var i = 0; i < tblLines.rows[0].cells.length; i++)
                {
                    var tdw = (tblHeader.rows[0].cells[i].clientWidth - 2);
                    tblLines.rows[0].cells[i].style.width = (tdw + "px");
                }
            }
            catch(err) { console.log("#ERROR resizeTable:", err); }
            setTimeout(function(){ resizeAddRow(); }, 10);
        }
        
        function addEventsCellsTable()
        {
            try
            {
                var putEvents = false;
                if(typeof that.tableField_change.name != "undefined")
                    putEvents = (that.tableField_change.name != "");
                else
                    putEvents = (that.tableField_change != "function(inp, oldValue){}");
                
                if(putEvents || that.blqFirstCol)
                {
                    var putEventRow = false;
                    if(typeof that.tableRow_click.name != "undefined")
                        putEventRow = (that.tableRow_click.name != "");
                    else
                        putEventRow = (that.tableRow_click != "function(tr){}");
                    
                    var tbl = ge(that.idTable);
                    
                    for(var i=0; i < tbl.rows.length; i++)
                    {
                        for(var j=0; j < tbl.rows[i].cells.length; j++)
                        {
                            var td = tbl.rows[i].cells[j];
                            if(j == 0 && that.blqFirstCol)
                            {
                                td.style.backgroundColor = that.tcolorHeader;
                                if(putEventRow)
                                {
                                    addEvent(td, "click", function(){ that.tableRow_click(this.parentNode); });
                                    addEvent(td, "mouseover", function(){ this.style.backgroundColor = that.tcolorSep; });
                                    addEvent(td, "mouseout", function(){ this.style.backgroundColor = that.tcolorHeader; });
                                }
                            }
                            else if(putEvents) addEvent(td, "click", function(){ cell_click(this); });
                        }
                    }
                }
            }catch(err){ console.error("#Error jtbl> addEventsCellsTable: " + err); }
        }
        
        function addRowsTable()
        {
            try
            {
                var putAddRow = false;
                if(typeof that.tableField_add.name != "undefined")
                    putAddRow = (that.tableField_add.name != "");
                else
                    putAddRow = (that.tableField_add != "function(tr){}");
                
                if(putAddRow)//footer add row
                {
                    var tblLines = ge(that.idTable);
                    var dElem = null, iElem = null, tElem = null, trElem = null, tdElem = null, nInp = null;
                    
                    tblLines.parentNode.style.overflow = "hidden";
                    tblLines.parentNode.style.overflow = "auto";
                    
                    tElem = document.createElement("table");
                    tElem.id = that.idTable + "_jtbl_tAddRow";
                    tElem.className = createCssClass(tElem.id + "_class", that.styleAddRowt);
                    tElem.style.display = "inline-block";
                    tElem.style.height = ((tblLines.rows[0].cells[0].clientHeight+4) + "px");
                    tElem.style.width = (tblLines.clientWidth + "px");
                    
                    ge(that.idTable + "_jtbl_2").appendChild(tElem);
                    
                    trElem = tElem.insertRow(0);
                    
                    var hh = 0, ww = 0;
                    for(var i = 0; i < tblLines.rows[0].cells.length; i++)
                    {
                        ww = tblLines.rows[0].cells[i].clientWidth;
                        hh = tElem.clientHeight;
                        
                        tdElem = trElem.insertCell(i);
                        tdElem.style.border = that.styleHeaderBorder;
                        tdElem.style.width = (ww-2)+"px";
                        tdElem.hasFocus = 0;
                        tdElem.innerHTML = "";
                        
                        if(i == 0 && that.blqFirstCol)
                        {
                            tdElem.innerHTML = "*";
                            tdElem.style.backgroundColor = that.tcolorHeader;
                            tdElem.style.cursor = "pointer";
                            addEvent(tdElem, "click", function(){ return _addRowCell_clear(tElem); });
                        }
                        else
                        {
                            nInp = document.createElement("input");
                            nInp.type = "text";
                            nInp.value = "";
                            
                            nInp.style.fontSize = that.styleAddRowcfs;
                            nInp.style.border = "solid 0 #000";
                            
                            if(that.cssSty==0)
                                nInp.style.height = (hh-6)+"px";
                            nInp.style.width = (ww-6)+"px";
                            tdElem.appendChild(nInp);
                            
                            addEvent(nInp, "focus", function(){ return _addRowCell_focus(this); });
                            addEvent(nInp, "blur", function(){ return _addRowCell_blur(this); });
                            addEvent(nInp, "keydown", function(event){ return _addRowCell_keydown(event, this); });
                        }
                    }
                    tdElem.style.borderRight = "solid 1px #000";
                }
            }
            catch(err){ console.error("#Error jtbl> addRowsTable: " + err); }
        }
        
        function resizeAddRow()
        {
            try
            {
                if(ge(that.idTable + "_jtbl_tAddRow"))
                {
                    var tblLines = ge(that.idTable);
                    var tElem = null, tdElem = null, nInp = null;
                    
                    tElem = ge(that.idTable + "_jtbl_tAddRow");
                    tElem.style.width = (tblLines.clientWidth + "px");
                    
                    var ww = 0;
                    for(var i = 0; i < tblLines.rows[0].cells.length; i++)
                    {
                        ww = tblLines.rows[0].cells[i].clientWidth;
                        
                        tdElem = tElem.rows[0].cells[i];
                        tdElem.style.width = (ww-2) + "px";
                        
                        if(tdElem.firstChild && tdElem.firstChild.nodeName.toUpperCase() == "INPUT")
                        {
                            nInp = tdElem.firstChild;
                            nInp.style.width = (ww-6) + "px";
                        }
                    }
                }
            }
            catch(err){ console.log("#ERROR resizeAddRow: ", err); }
        }
        
        function addSplTable()
        {
            try
            {
                that.spl = document.createElement("div");
                that.spl.id = that.idTable + "_jtbl_spl";
                that.spl.className = createCssClass(that.spl.id + "_class", that.styleSlp);
                that.spl.innerHTML = "";
                
                var th = ge(that.idTable).parentNode.clientHeight;
                that.spl.style.height = th + "px";
                
                var tt = ge(that.idTable).parentNode.offsetTop;
                that.spl.style.top = tt + "px";
                document.body.appendChild(that.spl);
            }
            catch(err){ console.error("#Error jtbl>  addSplTable: " + err); }
        }
        
        /* ** PRIVATE SUPPORT FUNCTIONS ****************************************************************************** */
        
        function cell_click(td)
        {
            if(!td.firstChild || td.firstChild.nodeName.toUpperCase() != "INPUT") //INPUT | TEXTAREA (testing)
            {
                var hh = td.clientHeight;
                var ww = td.clientWidth;
                
                var newIn = document.createElement("input"); //input | textarea (testing)
                newIn.name = that.idTable + "_jtbl_tInput";
                newIn.value = td.innerHTML;
                td.innerHTML = "";
                
                var cssName = that.idTable + "_jtbl_cellClick_class";
                if(getCss(cssName) == "") createCssClass(cssName, that.styleCellClick);
                newIn.className = cssName;
                
                var hhc = (that.cssSty==0?4:6);
                var wwc = (that.cssSty==0?4:6);
                
                newIn.style.height = ((hh-hhc) + "px");
                newIn.style.width = ((ww-wwc) + "px");
                
                td.appendChild(newIn);
                
                td.style.height = ((hh-2) + "px");
                td.style.width = ((ww-2) + "px");
                
                if(td.firstChild && td.firstChild.nodeName.toUpperCase() == "INPUT") //INPUT | TEXTAREA (testing)
                {
                    var inp = td.firstChild;
                    
                    addEvent(inp, "focus", function(){ _cell_focus(this); });
                    addEvent(inp, "blur", function(){ _cell_blur(this); });
                    addEvent(inp, "change", function(){ _cell_change(this); });
                    addEvent(inp, "keydown", function(event){ return _cell_keydown(event, this); });
                    
                    inp.focus();
                    that.tableField_click(inp);
                }
            }
        }
        
        function _tableHeader_click(pos)
        {
            that.srchField = pos;
            that.srchOrder = (that.srchOrder == "0" ? "1" : "0");
            
            that.tableHeader_click(that.srchField, that.srchOrder);
        }
        
        /* ** EVENTS HEADERS **************************************************************************************** */
        
        function _cellHeaderResize_mouseover(obj)
        {
            obj.style.cursor = "w-resize";
            obj.style.backgroundColor = that.tcolorSep;
        }
        
        function _cellHeaderResize_onmouseout(obj)
        {
            obj.style.cursor = "pointer";
            obj.style.backgroundColor = that.tcolorBorder;
        }
        
        function _cellHeaderResize_onmousedown(e, cnl)
        {
            try{
                if(!e) e = window.event;
                
                var leftClick = false;
                if (e.which) leftClick = (e.which == 1);
                else if (e.button) leftClick = (e.button == 1);
                
                if (leftClick)
                {
                    setTimeout(function(){showBlock(true);},10);
                    
                    that.spl_rx = true;
                    that.spl_cn = cnl;
                    that.spl_cxi = that.spl_cx;
                    
                    that.spl_lx = ge(that.idTable).rows[0].cells[that.spl_cn-1].clientWidth;
                    
                    splitLine();
                }
            }catch(err){ console.error("#Error jtbl> _cellHeaderResize_onmousedown: " + err); }
            return true;
        }
        
        /* ** EVENTS CELLS ****************************************************************************************** */
        
        function _cell_focus(inp)
        {
            try{
                original_value = inp.value;
            }catch(e){}
            return false;
        }
        
        function _cell_blur(inp)
        {
            try{
                var td = inp.parentNode;
                td.innerHTML = inp.value;
            }catch(e){}
            return false;
        }
        
        function _cell_change(inp)
        {
            var td = inp.parentNode;
            td.style.backgroundColor = that.tcolorTdChange;
            
            that.tableField_change(inp, original_value);
            
            setTimeout(function(){ resizeTable(); }, 10);
        }
        
        function _cell_keydown(e, inp)
        {
            var key = (e.which != null) ? e.which : e.keyCode;
            if(key == 13 || key == 9 || key == 37 || key == 38 || key == 39 || key == 40)
            {
                var td = inp.parentNode;
                var ntd = null;
                switch(key)
                {
                    case 13:
                        ntd = tdMoveRight(td);
                        break;
                    case 9:
                        ntd = tdMoveRight(td);
                        break;
                    case 37:
                        var data = getSelection(inp);
                        if(data.start < 1)
                            ntd = tdMoveLeft(td);
                        break;
                    case 38:
                        ntd = tdMoveUp(td);
                        break;
                    case 39:
                        var data = getSelection(inp);
                        if(data.start > inp.value.length-1)
                            ntd = tdMoveRight(td);
                        break;
                    case 40:
                        ntd = tdMoveDown(td);
                        break;
                }
                if(ntd != null) cell_click(ntd);
                return false;
            }
        }
        
        function tdMoveLeft(td)
        {
            var nxt = null;
			try
			{
				var cIndx = (that.blqFirstCol ? 2 : 1);
				var tdl = td.parentNode.cells.length-1;
				
                if(td.parentNode.cells[td.cellIndex-cIndx])
                    nxt = td.parentNode.cells[td.cellIndex-1];
                else if(td.parentNode.parentNode.rows[td.parentNode.rowIndex-1])
					nxt = td.parentNode.parentNode.rows[td.parentNode.rowIndex-1].cells[tdl];
                else
                    nxt = td.parentNode.cells[tdl];
			}catch(err){}
            return nxt;
        }
        
        function tdMoveUp(td)
        {
            var nxt = null;
			try{
				if(td.parentNode.parentNode.rows[td.parentNode.rowIndex-1])
					nxt = td.parentNode.parentNode.rows[td.parentNode.rowIndex-1].cells[td.cellIndex];
			}catch(err){}
            return nxt;
        }
        
        function tdMoveRight(td)
        {
            var nxt = null;
			try
			{
				var cIndx = (that.blqFirstCol ? 1 : 0);
				
                if(td.parentNode.cells[td.cellIndex+1])
                    nxt = td.parentNode.cells[td.cellIndex+1];
                else if(td.parentNode.parentNode.rows[td.parentNode.rowIndex+1])
                    nxt = td.parentNode.parentNode.rows[td.parentNode.rowIndex+1].cells[cIndx];
                else
                    nxt = td.parentNode.cells[cIndx];
			}catch(err){}
            return nxt;
        }
        
        function tdMoveDown(td)
        {
            var nxt = null;
			try{
				if(td.parentNode.parentNode.rows[td.parentNode.rowIndex+1])
					nxt = td.parentNode.parentNode.rows[td.parentNode.rowIndex+1].cells[td.cellIndex];
			}catch(err){ }
            return nxt;
        }
        
        function getSelection(inputBox)
        {
            if ("selectionStart" in inputBox)
            {
                return {
                    start: inputBox.selectionStart,
                    end: inputBox.selectionEnd
                }
            }
            else
            {
                //IE way
                var bookmark = document.selection.createRange().getBookmark();
                var selection = inputBox.createTextRange();
                selection.moveToBookmark(bookmark);
                var before = inputBox.createTextRange();
                before.collapse(true);
                before.setEndPoint("EndToStart", selection);
                var beforeLength = before.text.length;
                var selLength = selection.text.length;
                return {
                    start: beforeLength,
                    end: beforeLength + selLength
                }
            }
        }
        
        /* ** EVENTS CELLS ADD TABLE ******************************************************************************** */
        
        function _addRowCell_keydown(e, inp)
        {
            var key = (e.which != null) ? e.which : e.keyCode;
            if(key == 13 || key == 37 || key == 39 )
            {
                var td = inp.parentNode;
                var ntd = null;
                switch(key)
                {
                    case 13:
                        ntd = tdMoveRight(td);
                        if(ntd!=null && ntd != td.nextSibling){
                            if(td.firstChild) td.firstChild.blur();
                            ntd=null;
                        }
                        break;
                    case 37:
                        var data = getSelection(inp);
                        if(data.start < 1)
                            ntd = tdMoveLeft(td);
                        break;
                    case 39:
                        var data = getSelection(inp);
                        if(data.start > inp.value.length-1)
                            ntd = tdMoveRight(td);
                        break;
                }
                if(ntd!=null){if(ntd.firstChild) ntd.firstChild.focus();}
                return false;
            }
        }
        
        function _addRowCell_clear(tblAdd)
        {
            var tr = tblAdd.rows[0];
            setTimeout(function(){ AddRowCell_check(tr); }, 100);
        }
        
        function _addRowCell_focus(inp)
        {
            try
            {
                inp.parentNode.style.backgroundColor = that.tcolorSep;
                
                var td = inp.parentNode;
                td.hasFocus = 1;
            }
            catch(err){}
            return false;
        }
        
        function _addRowCell_blur(inp)
        {
            try
            {
                inp.parentNode.style.backgroundColor = that.tcolorBackground;
                
                var td = inp.parentNode;
                td.hasFocus = 0;
                
                var trs = inp.parentNode.parentNode;
                var i = 0;
                while(trs.cells[i] && trs.cells[i].firstChild != inp){ i++; }
                if(i == trs.cells.length-1) setTimeout(function(){ AddRowCell_check(trs); }, 100);
            }
            catch(err){}
            return false;
        }
        
        function AddRowCell_check(tr)
        {
            var focus = false, empty = true;
            for(var i = 0; i < tr.cells.length; i++){
                if(tr.cells[i].hasFocus == 1)
                    focus = true;
                if(tr.cells[i].firstChild && tr.cells[i].firstChild.nodeName.toUpperCase() == "INPUT"){
                    if(tr.cells[i].firstChild.value != "") empty = false;
                }
            }
            if(!focus && !empty)
                that.tableField_add(tr);
            
            var pos = (that.blqFirstCol ? 1 : 0);
            if(tr.cells[pos].firstChild && tr.cells[pos].firstChild.nodeName.toUpperCase() == "INPUT")
                tr.cells[pos].firstChild.focus();
        }
        
        /* ** SUPPORT *********************************************************************************************** */
        
        function ge(id)
        {
            return document.getElementById(id);
        }
        
        function createCssClass(cssClass, cssStyle)
        {
            try{
                var cssStr = "." + cssClass + " { " + cssStyle + " }";
                
                var styles = document.createElement("style");
                styles.setAttribute("type", "text/css");
                
                try{
                    var cssText = document.createTextNode(cssStr);
                    styles.appendChild(cssText);
                }catch(err){
                    if(styles.styleSheet){// IE
                        styles.styleSheet.cssText = cssStr;
                        that.cssSty=1;
                    }else{// OTHER
                        that.cssSty=-1;
                        throw "styles.styleSheet!";
                    }
                }
                
                document.getElementsByTagName("head")[0].appendChild(styles);
                return cssClass;
            }catch(err){ if(that.cssErr==0){console.error("#Error jtbl> createCssClass: IE compatibility view: " + err);that.cssErr=1;} }
            return "";
        }
        
        function getCss(s)
        {
            if(!document.styleSheets) return "";
            if(typeof s == "string") s = RegExp("\\b"+s+"\\b","i");
            var A, S, DS = document.styleSheets, n = DS.length, SA = [];
            while(n){
                S = DS[--n];
                A = (S.rules) ? S.rules: S.cssRules;
                for(var i = 0, L = A.length; i < L; i++){
                    tem = A[i].selectorText ? [A[i].selectorText, A[i].style.cssText]: [A[i]+""];
                    if(s.test(tem[0])) SA[SA.length]= tem;
                }
            }
            return SA.join("\r\n");
        }
        
        function addEvent(obj, type, fn)
        {
            if(obj.addEventListener)
                obj.addEventListener(type, fn, false);
            else if(obj.attachEvent)
            {
                obj['e'+type+fn] = fn;
                obj[type+fn] = function(){obj['e'+type+fn](window.event);}
                obj.attachEvent('on'+type, obj[type+fn]);
            }
        }
        
        function getRealOffset(elem)
        {
            //var elem = document.getElementById(id);
            var leftOffset = elem.offsetLeft;
            var topOffset = elem.offsetTop;
            var parent = elem.offsetParent;
            
            while(parent != document.body)
            {
                leftOffset += parent.offsetLeft;
                topOffset += parent.offsetTop;
                parent = parent.offsetParent;
            }
            var Offsets = {
                top: topOffset,
                left: leftOffset
            }
            return Offsets;
        }
        
        /* ROW RESIZE *********************************************************************************************** */
        
        function _jtbl_getMouseXY(e)
        {
            try
            {
                if (!e) var e = window.event;
                
                if (e.clientX) that.spl_cx = e.clientX + document.body.scrollLeft;
                else that.spl_cx = e.pageX;
                
                if (e.clientY) that.spl_cy = e.clientY + document.body.scrollTop;
                else that.spl_cy = e.pageY;
                
                if (that.spl_cx < 0 || !that.spl_cx) that.spl_cx = 0;
                if (that.spl_cy < 0 || !that.spl_cy) that.spl_cy = 0;
                
                if(that.spl_rx) splitLine();
            }
            catch(err){ }
            return true;
        }
        
        function _jtbl_release(event)
        {
            try
            {
                if(that.spl_rx)
                {
                    that.spl_rx = false;
                    that.spl.style.display = "none";
                    setTimeout(function(){showBlock(false);},10);
                    resizeColumn();
                }
            }
            catch(err){ }
        }
        
        function resizeColumn()
        {
            var size = that.spl_lx - (that.spl_cxi - that.spl_cx);
            ge(that.idTable + "_jtbl_tLinesHeader").rows[0].cells[that.spl_cn-1].style.width = size + "px";
            
            setTimeout(function(){ resizeTable(); }, 10);
        }
        
        function splitLine()
        {
            try{
                var th = ge(that.idTable).parentNode.clientHeight;
                that.spl.style.display = "block";
                that.spl.style.height = th + "px";
                var x = that.spl_cx;
                var xl = ge(that.idTable).rows[0].cells[that.spl_cn-1].offsetLeft+30;
                var xr = ge(that.idTable).offsetLeft + ge(that.idTable).clientWidth;
                x = (x < xl ? xl : x);
                x = (x > xr ? xr : x);
                that.spl.style.left = x + "px";
            }catch(err){ console.error("#Error jtbl> splitLine: " + err); }
        }
        
        function showBlock(show)
        {
            if(show)
            {
                if(ge(that.idTable + "_jtbl_block"))
                    ge(that.idTable + "_jtbl_block").style.visibility = "visible";
                else
                {
                    var blk = document.createElement("div");
                    blk.id = that.idTable + "_jtbl_block";
                    blk.innerHTML = ".";
                    blk.style.position = "absolute";
                    blk.style.bottom = "0px";
                    blk.style.right = "0px";
                    blk.style.height = "100%";
                    blk.style.width = "100%";
                    blk.style.backgroundColor = that.tcolorBackground;
                    blk.style.zIndex = "99998";
                    blk.style.filter = "alpha(opacity=00)";
                    blk.style.opacity = ".00";
                    
                    document.body.appendChild(blk);
                    blk.focus();
                }
            }
            else
            {
                if(ge(that.idTable + "_jtbl_block"))
                    ge(that.idTable + "_jtbl_block").style.visibility = "hidden";
            }
        }
        /* END ****************************************************************************************************** */
    };
    window.jtbl = jtbl;
})(window);
