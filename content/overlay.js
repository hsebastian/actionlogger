var ActionLoggerOverlay = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
  },

  onMenuItemCommand: function() {
    window.open("chrome://actionlogger/content/main-window.xul", "", "chrome");
  }
};

window.addEventListener("load", function(e) { ActionLoggerOverlay.onLoad(e); }, false); 
