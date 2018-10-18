import JSView from "sap/ui/core/mvc/JSView";
import Page from "sap/m/Page";
import ObjectHeader from "sap/m/ObjectHeader";
import ObjectAttribute from "sap/m/ObjectAttribute";
import ProductRating from "../control/ProductRating";

export default class Detail extends JSView {

  createContent(oController) {
    return (
      <Page
        title="{i18n>detailPageTitle}"
        showNavButton={true}
        navButtonPress={oController.onNavBack}
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
          change={oController.onRatingChange.bind(oController)}
        />
      </Page>
    );
  }

}
