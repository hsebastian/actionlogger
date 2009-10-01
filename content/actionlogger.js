var ActionLogger = {
  
  _clearButton : null,
  _outputBox : null,
  
  onLoad: function() {
    this.init();
    this.initialized = true;
  },
  
  init: function() {
    _clearButton = document.getElementById("clearButton");
    _clearButton.addEventListener("click", this.onClick, false);
    _outputBox = document.getElementById("outputBox");
    _outputBox.value = "Opened!";
  },
  
  onClick: function() {
    var date = new Date();
    _outputBox.value = date.toLocaleString();
  },
  
};

// alert("clicked");
window.addEventListener("load", function(e) { ActionLogger.onLoad(e); }, false); 
