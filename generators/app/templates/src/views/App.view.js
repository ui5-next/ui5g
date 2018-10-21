import Application from "sap/m/App";
import JSView from "sap/ui/core/mvc/JSView";

export default class App extends JSView {

  onOpenDialog() {
    this.getController().getOwnerComponent().openHelloDialog();
  }

  createContent(controller) {
    this.addStyleClass(controller.getOwnerComponent().getContentDensityClass());
    return new Application({ id: "app" });
  }

}
