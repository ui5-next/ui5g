import Shell from "sap/m/Shell";
import ComponentContainer from "sap/ui/core/ComponentContainer";
import Component from "./Component";
import ui from "sap/ui";

ui.getCore().attachInit(()=>{
  var container = new Shell({ app: new ComponentContainer({ component: new Component() }) });
  container.placeAt("content");
})
