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
  onClick: function(target) {
    alert(target.element.id);
    target.clear();
  },
  connect: function(target) {
    this.target = target;
    this.element.addEventListener("click", function(e) { target.clear(); }, false);
  },
};

var OutputBox = {
  window: null,
  get element() {
    return document.getElementById("outputBox");
  },
  clear: function() {
    this.element.value = "";
  },
  log: function(e) {
    var date = new Date();
    var id = e.target.id.toString();
    this.element.value = date.toLocaleString() + " " + id + " " + e.type.toString();
  },
};

var OutputTable = {
  get element() {
    return document.getElementById("outputTableEntries");
  },
  clear: function() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  },
  log: function(e) {
    this.insert(e);
  },
  insert: function(evin) {
    const xulns = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    
    var elementcell = document.createElementNS(xulns, "treecell");
    elementcell.setAttribute("label", evin.target.id);
    
    var eventcell = document.createElementNS(xulns, "treecell");
    eventcell.setAttribute("label", evin.type);
    
    var treerow = document.createElementNS(xulns, "treerow");
    treerow.appendChild(elementcell);
    treerow.appendChild(eventcell);
    
    var treeitem = document.createElementNS(xulns, "treeitem");
    treeitem.setAttribute("container", "true");
    treeitem.setAttribute("open", "true");
    treeitem.appendChild(treerow);
    
    return this.element.appendChild(treeitem);
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
    this.window.addEventListener("click", function(e) { logger.log(e); }, false);
  },
};

function EventInfo(event, window){

    // properties
    this.target = event.target.id;
    this.nodeName = event.target.nodeName;
    this.action = event.type;
    this.timestamp = time.now();
    
    this.elements = new Array();
    var target = window.document.getElementById(this.target);
    while(target.parentNode.id != MainWindow.rootElementId) {
      target = target.parentNode;
      elements.push(target.id);
    }
    
    // methods
    if (typeof this.sayName != "function"){
      
      Person.prototype.sayName = function(){
          alert(this.name);
      };
    }
        /*
    var elements = new Array();
    target = mainWindow.document.getElementById(id); 
    
    while(target.parentNode.id != MainWindow.rootElementId) {
      target = target.parentNode;
      elements.push(target.id);
    }
    
    while(elements.length != 0) {
      outputBox.value = outputBox.value + " " + elements.shift();
    }*/
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
