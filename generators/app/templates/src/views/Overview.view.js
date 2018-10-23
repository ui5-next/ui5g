import JSView from "sap/ui/core/mvc/JSView";
import Page from "sap/m/Page";
import Button from "sap/m/Button";
// please make sure your View js file is ended with .view.js
// otherwise, ui5 module system can not infer its location
import HelloPanel from "./HelloPanel.view";
import InvoiceList from "./InvoiceList.view";

export default class App extends JSView {

  createContent(controller) {
    this.addStyleClass(controller.getOwnerComponent().getContentDensityClass());
    return (
      <Page
        title="{i18n>appTitle}"
        headerContent={
          <Button
            icon="sap-icon://hello-world"
            press={() => {
              this.oController.getOwnerComponent().openHelloDialog();
            }}
          />
        }
      >
        {
          // extra will be passed into HelloPanel internal
          // and use this.getViewData().extra to get it
        }
        <HelloPanel extra="this_is_a_test_string" />
        <InvoiceList />
      </Page>
    );
  }

}
