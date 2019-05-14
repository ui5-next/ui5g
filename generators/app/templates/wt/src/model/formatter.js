export const createFormatter = oView => ({
  statusText: function(sStatus) {
    var oResourceBundle = oView.getModel("i18n").getResourceBundle();

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