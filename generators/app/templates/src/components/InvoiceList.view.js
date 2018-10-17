import Button from "sap/ui/commons/Button";
import JSView from "sap/ui/core/mvc/JSView";

export default class InvoiceList extends JSView {

  createContent(oController) {
    var oButton = new Button({ text: "Hello JS View" });
    oButton.attachPress(oController.handleButtonClicked);
    return oButton;
  }

}
