import JSView from "sap/ui/core/mvc/JSView";
import Page from "sap/m/Page";
import ObjectHeader from "sap/m/ObjectHeader";
import ObjectAttribute from "sap/m/ObjectAttribute";
import ProductRating from "../control/ProductRating";

import History from "sap/ui/core/routing/History";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

export default class Detail extends JSView {


  _onObjectMatched(oEvent) {
    this.bindElement({
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
      var oRouter = UIComponent.getRouterFor(this);
      oRouter.navTo("overview", {}, true);
    }
  }

  private _getI18NModel(): ResourceModel {
    return this.getModel("i18n") as ResourceModel
  }

  private _getI18NModelResourceBundle(): ResourceBundle {
    return this._getI18NModel().getResourceBundle() as ResourceBundle
  }

  onRatingChange(oEvent) {
    var fValue = oEvent.getParameter("value");
    var oResourceBundle = this._getI18NModelResourceBundle()

    MessageToast.show(oResourceBundle.getText("ratingConfirmation", [fValue]));
  }

  createContent() {

    var oViewModel = new JSONModel({ currency: "EUR" });
    this.setModel(oViewModel, "view");

    var oRouter = UIComponent.getRouterFor(this);

    oRouter.getRoute("detail").attachPatternMatched(undefined, this._onObjectMatched.bind(this), this);

    return (
      <Page
        title="{i18n>detailPageTitle}"
        showNavButton={true}
        navButtonPress={this.onNavBack.bind(this)}
      >
        <ObjectHeader
          responsive={true}
          fullScreenOptimized={true}
          number={{
            parts: [
              { path: "invoice>ExtendedPrice" },
              { path: "view>/currency" }
            ],
            type: "sap.ui.model.type.Currency",
            formatOptions: {
              showMeasure: false
            }
          }}
          numberUnit="{view>/currency}"
          intro="{invoice>ShipperName}"
          title="{invoice>ProductName}"
          attributes={[
            <ObjectAttribute
              title="{i18n>quantityTitle}"
              text="{invoice>Quantity}"
            />,
            <ObjectAttribute
              title="{i18n>dateTitle}"
              text={{
                path: "invoice>ShippedDate",
                type: "sap.ui.model.type.Date",
                formatOptions: {
                  style: "long",
                  source: {
                    pattern: "yyyy-MM-ddTHH:mm:ss"
                  }
                }
              }}
            />
          ]}
        />
        <ProductRating
          class="sapUiSmallMarginBeginEnd"
          change={this.onRatingChange.bind(this)}
        />
      </Page>
    );
  }

}
