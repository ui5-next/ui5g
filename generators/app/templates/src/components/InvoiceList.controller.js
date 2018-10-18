import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import { formatter } from "../model/formatter";

export default class InvoiceList extends Controller {

  formatter = formatter;

  onInit() {
    var oViewModel = new JSONModel({
      currency: "EUR"
    });
    this.getView().setModel(oViewModel, "view");
  }

  onFilterInvoices(oEvent) {

    // build filter array
    var aFilter = [];
    var sQuery = oEvent.getParameter("query");
    if (sQuery) {
      aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
    }

    // filter binding
    var oList = sap.ui.getCore().byId("invoiceList");
    var oBinding = oList.getBinding("items");
    oBinding.filter(aFilter);
  }

  onPress(oEvent) {
    var oItem = oEvent.getSource();
    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    oRouter.navTo("detail", {
      invoicePath: oItem.getBindingContext("invoice").getPath().substr(1)
    });
  }

}
