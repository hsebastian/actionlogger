const XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"

var ActionLogger = {
  
  clearButton : null,
  outputBox : null,
  outputTable: null,
  mainWindow: null,
  dumpButton: null,
  listenerButton: null,
  
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
    listenerButton = document.getElementById("listenerButton");
    
    mainWindow.connect(outputBox);
    mainWindow.connect(outputTable);
    outputBox.element.value = "Just Opened!";
    outputTable.init();
    clearButton.addEventListener("click", function(e) { outputBox.clear(); }, false);
    clearButton.addEventListener("click", function(e) { outputTable.clear(); }, false);
    dumpButton.addEventListener("click", function(e) { outputTable.dump(); }, false);
    listenerButton.addEventListener("click", function(e) { outputTable.togglelog(); }, false);
  },
};

function EventInfo(event){
  
  this.action = event.type;
  this.targets = new Array();
  
  var t = event.originalTarget;
  while(t != null && t.id != MainWindow.rootElementId) {
    this.targets.push(new Target(t));
    t = t.parentNode;
  }
}

function Target(target){
  this.nodeName = target.nodeName;
  this.identifier = null;
  
  if(target.hasAttribute("id")) {
    this.identifier = "id: " + target.getAttribute("id");
  } else if (target.hasAttribute("anonid")) {
    this.identifier = "anonid: " + target.getAttribute("anonid");
  } else if (target.hasAttribute("itemid")) {
    this.identifier = "itemid: " + target.getAttribute("itemid");
  } else if (target.hasAttribute("class")) {
    this.identifier = "class: " + target.getAttribute("class");
  } else if (target.hasAttribute("uri")) {
    this.identifier = "uri: " + target.getAttribute("uri");
  } else if (target.hasAttribute("url")) {
    this.identifier = "url: " + target.getAttribute("url");
  } else if (target.hasAttribute("label")) {
    this.identifier = "label: " + target.getAttribute("label");
  } else {
    this.identifier = "(see container's identifier)";
  }
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
    this.element.value = date.toLocaleString() + " | " + eventinfo.action;
    while(eventinfo.targets.length != 0) {
      var t = eventinfo.targets.shift();
      this.element.value = this.element.value + " | " + t.nodeName + " - " + t.identifier;
    }
  },
};

var OutputTable = {
  
  entries: null,
  element: null,
  listening: true,
  
  init: function() {
    this.entries = new Array();
    this.element = document.getElementById("outputTableEntries");
    this.listening = true;
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
    if(this.entries.length < 100 && this.listening) {
      this.insert(e);
    }
  },
  
  insert: function(eventinfo) {
    
    this.entries.push(eventinfo);
    
    var toptreechildren = this.element;
    
    for(var i = 0; i < eventinfo.targets.length; i++) {
      var elementcell = document.createElementNS(XULNS, "treecell");
      elementcell.setAttribute("label", eventinfo.targets[i].nodeName);
      
      var eventcell = document.createElementNS(XULNS, "treecell");
      eventcell.setAttribute("label", eventinfo.targets[i].identifier);
      
      var treerow = document.createElementNS(XULNS, "treerow");
      treerow.appendChild(elementcell);
      treerow.appendChild(eventcell);
      
      var treechildren = document.createElementNS(XULNS, "treechildren");
      
      var treeitem = document.createElementNS(XULNS, "treeitem");
      treeitem.setAttribute("container", "true");
      if(i == 0)
        treeitem.setAttribute("open", "false");
      else
        treeitem.setAttribute("open", "true");
      treeitem.appendChild(treerow);
      treeitem.appendChild(treechildren);
      
      toptreechildren.appendChild(treeitem);
      toptreechildren = treechildren;
    }
    
  },
  
  dump: function() {
    if(this.entries.length > 0) {
      
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
        for(var i = 0; i < this.entries.length; i++)
          converter.writeString(JSON.stringify(this.entries[i]) + "," + "\n");
        converter.close();
      }
    }
  },
  
  togglelog: function() {
    if(this.listening)
      this.listening = false;
    else
      this.listening = true;
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
    this.window.addEventListener("click", function(e) { logger.log(new EventInfo(e)); }, false);
  },
};

window.addEventListener("load", function(e) { ActionLogger.onLoad(e); }, false); 
