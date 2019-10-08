import Application from "sap/m/App";
import JSView from "sap/ui/core/mvc/JSView";
import Controller from "sap/ui/core/mvc/Controller";
import Component from "../Component";

export default class App extends JSView {

  private _getComponent(): Component {
    return (this.getController() as Controller).getOwnerComponent() as Component
  }

  onOpenDialog() {
    this._getComponent().openHelloDialog();
  }

  createContent(controller: Controller) {
    this.addStyleClass(this._getComponent().getContentDensityClass());
    return new Application({ id: "app" });
  }

}
