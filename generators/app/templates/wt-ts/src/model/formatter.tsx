import JSView from "sap/ui/core/mvc/JSView";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

export const createFormatter = (oView: JSView<any>) => ({
  statusText: function (sStatus) {

    var oResourceBundle = (oView.getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;

    switch (sStatus) {
      case "A":
        return oResourceBundle.getText("invoiceStatusA");
      case "B":
        return oResourceBundle.getText("invoiceStatusB");
      case "C":
        return oResourceBundle.getText("invoiceStatusC");
      default:
        return oResourceBundle.getText("invoiceStatusA");
    }

  }
});
