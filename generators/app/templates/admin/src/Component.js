import UIComponent from "sap/ui/core/UIComponent";
import { manifest } from "./manifest";
import models from "./model/models";

export default class Component extends UIComponent {

  metadata = {
    manifest
  }

  init() {
    super.init(this, arguments);

    // set the device model
    this.setModel(models.createDeviceModel(), "device");

    // create the views based on the url/hash
    this.getRouter().initialize();
  }

  myNavBack() {
    var oHistory = History.getInstance();
    var oPrevHash = oHistory.getPreviousHash();
    if (oPrevHash !== undefined) {
      window.history.go(-1);
    } else {
      this.getRouter().navTo("masterSettings", {}, true);
    }
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