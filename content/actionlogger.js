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
  
  onClick: function(outputbox) {
    // clear all row entries in the outputbox 
    outputbox.value = "";
  },
};

var OutputBox = {
  entries: null,
  get element() {
    return document.getElementById("outputBox");
  },
  clear: function() {
    // entries.clear();
  },
  insert: function(evin) {
    // 
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
    }
    return win;
  },  
  
};

/*function Entry(event){

    // properties
    this.target = event.target.id;
    this.target = event.target.nodeName;
    this.action = event.type;
    //this.timestamp = time.now();
    
    // methods
    if (typeof this.sayName != "function"){
      
      Person.prototype.sayName = function(){
          alert(this.name);
      };
    }
    
}
        <treeitem container="true" open="true">        
            <treerow>        
                <treecell label="TARGET" properties="{any-props-for-css}"/>
                <treecell label="ACTION" properties="{any-props-for-css}"/>       
            </treerow>
            <treechildren>        
                <treeitem container="true" open="true">        
                    <treerow>        
                        <treecell label="TARGET'S PARENT" properties="{any-props-for-css}"/>        
                    </treerow>
                    <treechildren>        
                        <treeitem container="true" open="true">       
                            <treerow>       
                                <treecell label="TARGET'S GRANDPARENT" properties="{any-props-for-css}"/>       
                            </treerow>       
                        </treeitem>       
                    </treechildren>         
                </treeitem>        
            </treechildren>              
        </treeitem>
*/

/*function EventInfo(event){

    // properties
    this.target = event.target.id;
    this.target = event.target.nodeName;
    this.action = event.type;
    //this.timestamp = time.now();
    
    // methods
    if (typeof this.sayName != "function"){
      
      Person.prototype.sayName = function(){
          alert(this.name);
      };
    }
    
}
*/

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
