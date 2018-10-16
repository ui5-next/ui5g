
import Component from "./Component";

sap.ui.getCore().attachInit(function() {
  new sap.m.Shell({
    app: new sap.ui.core.ComponentContainer({
      component: new Component()
    })
  }).placeAt("content");
});