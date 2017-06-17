import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";

export default class Detail extends Controller {

  onInit() {
    var oViewModel = new JSONModel({
      currency: "EUR"
    });
    this.getView().setModel(oViewModel, "view");

    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
  }

  _onObjectMatched(oEvent) {
    this.getView().bindElement({
      path: "/" + oEvent.getParameter("arguments").invoicePath,
      model: "invoice"
    });
  }

  onNavBack() {
    var oHistory = History.getInstance();
    var sPreviousHash = oHistory.getPreviousHash();

    if (sPreviousHash !== undefined) {
      window.history.go(-1);
    } else {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("overview", {}, true);
    }
  }

  onRatingChange() {
    var fValue = oEvent.getParameter("value");
    var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

    MessageToast.show(oResourceBundle.getText("ratingConfirmation", [fValue]));
  }

}