var ActionLogger = {
  
  clearButton : null,
  outputBox : null,
  mainWindow: null,
  
  onLoad: function() {
    this.init();
    this.initialized = true;
  },
  
  init: function() {
    outputBox = OutputBox.element;
    outputBox.value = "Opened!";
    
    clearButton = ClearButton.element;
    clearButton.addEventListener("click", function(e) { ClearButton.onClick(outputBox); }, false);
    
    mainWindow = MainWindow.window
    mainWindow.addEventListener("click", function(e) { ActionLogger.log(e); }, false);
  },
  
  log: function(e) {
    var date = new Date();
    var id = e.target.id.toString()
    
    outputBox.value = date.toLocaleString() + " " + id + " " + e.type.toString();
    
    var elements = new Array();
    target = mainWindow.document.getElementById(id); 
    
    while(target.parentNode.id != MainWindow.rootElementId) {
      target = target.parentNode;
      elements.push(target.id);
    }
    
    while(elements.length != 0) {
      outputBox.value = outputBox.value + " " + elements.shift();
    }
  },  
};

var ClearButton = {
  get element() {
    return document.getElementById("clearButton");
  },
  
  onClick: function(x) {
    var date = new Date();
    x.value = "";
  },
};

var OutputBox = {
  get element() {
    return document.getElementById("outputBox");
  },
};

var MainWindow = {
  rootElementId: "main-window",
  get window() {
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                       .getService(Components.interfaces.nsIWindowMediator);
    //var win = wm.getMostRecentWindow("navigator:browser");
    var enumerator = wm.getEnumerator("navigator:browser");
    while(enumerator.hasMoreElements()) {  
      var win = enumerator.getNext();
      //var mainwindow = win.document.getElementById(this.id);
    }
    return win;
  },  

};

// alert("clicked");
window.addEventListener("load", function(e) { ActionLogger.onLoad(e); }, false); 
