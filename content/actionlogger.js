const XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"

var ActionLogger = {
  
  clearButton : null,
  outputBox : null,
  outputTable: null,
  mainWindow: null,
  
  onLoad: function() {
    this.init();
    this.initialized = true;
  },
  
  init: function() {
    outputBox = OutputBox;
    clearButton = ClearButton;
    mainWindow = MainWindow;
    outputTable = OutputTable;
    
    outputBox.element.value = "Opened1!";
    clearButton.connect(outputBox);
    clearButton.connect(outputTable);
    mainWindow.connect(outputBox);
    mainWindow.connect(outputTable);
  },
};

var ClearButton = {
  
  target: null,
  
  get element() {
    return document.getElementById("clearButton");
  },
  
  connect: function(target) {
    this.target = target;
    this.element.addEventListener("click", function(e) { target.clear(); }, false);
  },
};

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
  
  entryCount: 0,
  
  get element() {
    return document.getElementById("outputTableEntries");
  },
  
  clear: function() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    this.entryCount = 0;
  },
  
  log: function(e) {
    if(this.entryCount < 100) {
      this.insert(e);
    }
  },
  
  insert: function(eventinfo) {    
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
    this.insertContainers(treeitem, eventinfo);
    
    this.element.appendChild(treeitem);
    this.entryCount++;
  },
  
  insertContainers: function(treeitemparam, eventinfo) {
    var toptreeitem = treeitemparam;
    while(eventinfo.containers.length != 0) {
      var elementcell = document.createElementNS(XULNS, "treecell");
      elementcell.setAttribute("label", eventinfo.containers.shift());
      
      var treerow = document.createElementNS(XULNS, "treerow");
      treerow.appendChild(elementcell);
      
      var treeitem = document.createElementNS(XULNS, "treeitem");
      treeitem.setAttribute("container", "true");
      treeitem.setAttribute("open", "true");
      treeitem.appendChild(treerow);
      
      var treechildren = document.createElementNS(XULNS, "treechildren");
      treechildren.appendChild(treeitem);
      
      toptreeitem.appendChild(treechildren);
      toptreeitem = treeitem
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
  if (typeof this.nodeName != "function"){
    
    EventInfo.prototype.nodeName = function(){
        alert(this.target);
    };
  }
}

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
};
// alert("clicked");
*/

window.addEventListener("load", function(e) { ActionLogger.onLoad(e); }, false); 
