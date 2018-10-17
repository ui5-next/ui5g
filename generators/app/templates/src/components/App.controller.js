import Controller from "sap/ui/core/mvc/Controller";

export default class App extends Controller {

  onInit() {
    this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
  }

  onOpenDialog() {
    this.getOwnerComponent().openHelloDialog();
  }

}