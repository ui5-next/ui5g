import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import HelloDialog from "./controller/HelloDialog";
import Device from "sap/ui/Device";

export default class Component extends UIComponent {

  metadata = {
    manifest: "json"
  }

  init() {

    // call the init function of the parent
    UIComponent.prototype.init.apply(this, arguments);

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

    // set dialog
    this._helloDialog = new HelloDialog(this.getAggregation("rootControl"));

    // create the views based on the url/hash
    this.getRouter().initialize();

  }

  openHelloDialog() {
    this._helloDialog.open();
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