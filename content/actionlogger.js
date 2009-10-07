const XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"

var ActionLogger = {
  
  clearButton : null,
  outputBox : null,
  outputTable: null,
  mainWindow: null,
  dumpButton: null,
  
  onLoad: function() {
    this.init();
    this.initialized = true;
  },
  
  init: function() {
    mainWindow = MainWindow;
    outputBox = OutputBox;
    outputTable = OutputTable;
    clearButton = document.getElementById("clearButton");
    dumpButton = document.getElementById("dumpButton");
    
    mainWindow.connect(outputBox);
    mainWindow.connect(outputTable);
    outputBox.element.value = "Just Opened!";
    outputTable.init();
    clearButton.addEventListener("click", function(e) { outputBox.clear(); }, false);
    clearButton.addEventListener("click", function(e) { outputTable.clear(); }, false);
    dumpButton.addEventListener("click", function(e) { outputTable.dump(); }, false);
  },
};

function EventInfo(event, window){
  
  // properties
  this.target = event.target.id;
  this.nodeName = event.target.nodeName;
  this.action = event.type;
  this.containers = new Array();
  
  var target = window.document.getElementById(this.target);
  while(target.parentNode.id != MainWindow.rootElementId) {
    target = target.parentNode;
    this.containers.push(target.id);
  }
  
  // methods
  /*if (typeof this.nodeName != "function"){
    
    EventInfo.prototype.nodeName = function(){
        alert(this.target);
    };
  }*/
}

var OutputBox = {
  
  get element() {
    return document.getElementById("outputBox");
  },
  
  clear: function() {
    this.element.value = "";
  },
  
  log: function(eventinfo) {
    var date = new Date();
    this.element.value = date.toLocaleString() + " | " + eventinfo.target + " | " + eventinfo.nodeName + " | " + eventinfo.action;
    while(eventinfo.containers.length != 0) {
      this.element.value = this.element.value + " | " + eventinfo.containers.shift();
    }
  },
};

var OutputTable = {
  
  entries: null,
  element: null,
  
  init: function() {
    this.entries = new Array();
    this.element = document.getElementById("outputTableEntries");
  },
  
  clear: function() {
    
    while (this.entries.length > 0) {
      this.entries.shift();
    }
    
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  },
  
  log: function(e) {
    if(this.entries.length < 100) {
      this.insert(e);
    }
  },
  
  insert: function(eventinfo) {
    
    this.entries.push(eventinfo);
    
    var elementcell = document.createElementNS(XULNS, "treecell");
    elementcell.setAttribute("label", eventinfo.target);
    
    var eventcell = document.createElementNS(XULNS, "treecell");
    eventcell.setAttribute("label", eventinfo.action);
    
    var treerow = document.createElementNS(XULNS, "treerow");
    treerow.appendChild(elementcell);
    treerow.appendChild(eventcell);
    
    var treeitem = document.createElementNS(XULNS, "treeitem");
    treeitem.setAttribute("container", "true");
    treeitem.setAttribute("open", "false");
    treeitem.appendChild(treerow);
    
    // add ancestors
    this._insertContainers(treeitem, eventinfo);
    
    this.element.appendChild(treeitem);
  },
  
  _insertContainers: function(treeitemparam, eventinfo) {
    var toptreeitem = treeitemparam;
    
    for(var i = 0; i < eventinfo.containers.length; i++) {
      var elementcell = document.createElementNS(XULNS, "treecell");
      elementcell.setAttribute("label", eventinfo.containers[i]);
      
      var treerow = document.createElementNS(XULNS, "treerow");
      treerow.appendChild(elementcell);
      
      var treeitem = document.createElementNS(XULNS, "treeitem");
      treeitem.setAttribute("container", "true");
      treeitem.setAttribute("open", "true");
      treeitem.appendChild(treerow);
      
      var treechildren = document.createElementNS(XULNS, "treechildren");
      treechildren.appendChild(treeitem);
      
      toptreeitem.appendChild(treechildren);
      toptreeitem = treeitem;
    }
  },
  
  dump: function() {
    if(this.entries.length > 0) {
      
      var data = JSON.stringify(this.entries);
      
      const nsIFilePicker = Components.interfaces.nsIFilePicker;
      
      var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
      fp.init(window, "Save Output As", nsIFilePicker.modeSave);
      fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);
      
      var rv = fp.show();
      if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
        var file = fp.file;
        var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
                                 createInstance(Components.interfaces.nsIFileOutputStream);
        
        // flag: PR_WRONLY | PR_CREATE_FILE | PR_TRUNCATE, mode: ?
        foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0); 
        var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
                                  .createInstance(Components.interfaces.nsIConverterOutputStream);
        
        // buffer size: CONVERTER_BUFFER_SIZE 8192, replacement char: none 
        converter.init(foStream, "UTF-8", 0, 0);
        converter.writeString(data);
        converter.close();
      }
    }
  },
};

var MainWindow = {
  
  rootElementId: "main-window",
  
  get window() {
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                       .getService(Components.interfaces.nsIWindowMediator);
    var enumerator = wm.getEnumerator("navigator:browser");
    while(enumerator.hasMoreElements()) {  
      var win = enumerator.getNext();
    }
    return win;
  },  
  
  connect: function(logger) {
    this.window.addEventListener("click", function(e) { logger.log(new EventInfo(e, MainWindow.window)); }, false);
  },
};

/*var ListenerButton = {
  
  state: true,
  
  get element() {
    return document.getElementById("listenerButton");
  },
  
  toggle: function() {
    if(this.state) { 
      state = false;
    } else {
      state = true;
    }
  },
  
  connect: function(target) {
    this.element.addEventListener("click", function(e) { target.toggle(); }, false);
  },
};
// alert("clicked");
*/
/*
var fp = Components.classes["@mozilla.org/filepicker;1"]
	           .createInstance(Components.interfaces.nsIFilePicker);
fp.init(window, "Dialog Title", nsIFilePicker.modeOpen);
fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);

var rv = fp.show();
if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
  var file = fp.file;
  // Get the path as string. Note that you usually won't 
  // need to work with the string paths.
  var path = fp.file.path;
  // work with returned nsILocalFile...
}
*/
window.addEventListener("load", function(e) { ActionLogger.onLoad(e); }, false); 
