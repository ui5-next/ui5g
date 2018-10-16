import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";

export default class HelloPanel extends Controller {

  onShowHello() {

    // read msg from i18n model
    var oBundle = this.getView().getModel("i18n").getResourceBundle();
    var sRecipient = this.getView().getModel().getProperty("/recipient/name");
    var sMsg = oBundle.getText("helloMsg", [sRecipient]);
    // show message
    MessageToast.show(sMsg);

  }

  onOpenDialog() {
    this.getOwnerComponent().openHelloDialog();
  }

}