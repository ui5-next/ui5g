import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device";
import { createHelloDialog } from "./fragments/HelloDialog";
import { manifest } from "./manifest";

export default class Component extends UIComponent {

  metadata = {
    manifest
  }

  init() {
    super.init(this, arguments);
    // set data model
    var oData = {
      recipient: {
        name: "World"
      }
    };
    var oModel = new JSONModel(oData);
    this.setModel(oModel);

    // set device model
    var oDeviceModel = new JSONModel(Device);
    oDeviceModel.setDefaultBindingMode("OneWay");
    this.setModel(oDeviceModel, "device");

    // create the views based on the url/hash
    this.getRouter().initialize();

  }

  openHelloDialog() {
    const oView = this.getAggregation("rootControl");
    // create dialog lazily
    if (!this._dialog) {
      var oFragmentController = {
        onCloseDialog: () => {
          this._dialog.close();
        }
      };
      // create dialog via fragment factory
      this._dialog = createHelloDialog(oFragmentController);
      // connect dialog to the root view of this component (models, lifecycle)
      oView.addDependent(this._dialog);
      // forward compact/cozy style into dialog
      jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, this._dialog);
    }
    this._dialog.open();
  }

  getContentDensityClass() {
    if (!this._sContentDensityClass) {
      if (!sap.ui.Device.support.touch) {
        this._sContentDensityClass = "sapUiSizeCompact";
      } else {
        this._sContentDensityClass = "sapUiSizeCozy";
      }
    }
    return this._sContentDensityClass;
  }

}