export const formatter = function () {
  return {
    statusText: function (sStatus) {
      var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

      switch (sStatus) {
        case "A":
          return oResourceBundle.getText("invoiceStatusA");
        case "B":
          return oResourceBundle.getText("invoiceStatusB");
        case "C":
          return oResourceBundle.getText("invoiceStatusC");
        default:
          return sStatus;
      }
    }
  };
};