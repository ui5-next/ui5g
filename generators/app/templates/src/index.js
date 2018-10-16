import ComponentContainer from "sap/ui/core/ComponentContainer";
import Component from "./Component";

sap.ui.getCore().boot();

var container = new ComponentContainer({ component: new Component() });

container.placeAt("content");