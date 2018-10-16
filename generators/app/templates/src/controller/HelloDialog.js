import Object from "sap/ui/base/Object";

export default class HelloDialog extends Object {

  constructor(oView) {
    this._oView = oView;
  }

  open() {
    var oView = this._oView;
    var oDialog = oView.byId("helloDialog");

    // create dialog lazily
    if (!oDialog) {
      var oFragmentController = {
        onCloseDialog: function() {
          oDialog.close();
        }
      };
      // create dialog via fragment factory
      oDialog = sap.ui.xmlfragment(oView.getId(), "ui5.demo.walkthrough.view.HelloDialog", oFragmentController);
      // connect dialog to the root view of this component (models, lifecycle)
      oView.addDependent(oDialog);
      // forward compact/cozy style into dialog
      jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
    }
    oDialog.open();
  }

}