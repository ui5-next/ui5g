
sap.ui.getCore().attachInit(function() {
    new sap.m.Shell({
      app: new sap.ui.core.ComponentContainer({
        name: "<%= namespace %>"
      })
    }).placeAt("content");
  });