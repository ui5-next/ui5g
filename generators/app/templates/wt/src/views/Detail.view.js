import JSView from "sap/ui/core/mvc/JSView";
import Page from "sap/m/Page";
import ObjectHeader from "sap/m/ObjectHeader";
import ObjectAttribute from "sap/m/ObjectAttribute";
import ProductRating from "../control/ProductRating";

import History from "sap/ui/core/routing/History";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";

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
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("overview", {}, true);
    }
  }

  onRatingChange(oEvent) {
    var fValue = oEvent.getParameter("value");
    var oResourceBundle = this.getModel("i18n").getResourceBundle();

    MessageToast.show(oResourceBundle.getText("ratingConfirmation", [fValue]));
  }

  createContent() {

    var oViewModel = new JSONModel({ currency: "EUR"});
    this.setModel(oViewModel, "view");

    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched.bind(this), this);

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
              { path: 'invoice>ExtendedPrice' },
              { path: 'view>/currency' }
            ],
            type: 'sap.ui.model.type.Currency',
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
                path: 'invoice>ShippedDate',
                type: 'sap.ui.model.type.Date',
                formatOptions: {
                  style: 'long',
                  source: {
                    pattern: 'yyyy-MM-ddTHH:mm:ss'
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
