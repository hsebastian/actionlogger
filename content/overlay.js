var ActionLogger = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
  },

  onMenuItemCommand: function() {
    window.open("chrome://actionlogger/content/main-window.xul", "", "chrome");
  }
};

window.addEventListener("load", function(e) { ActionLogger.onLoad(e); }, false); 
