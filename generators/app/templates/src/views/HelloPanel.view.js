import JSView from "sap/ui/core/mvc/JSView";
import Panel from "sap/m/Panel";
import Button from "sap/m/Button";
import Input from "sap/m/Input";
import Text from "sap/m/Text";
import MessageToast from "sap/m/MessageToast";

export default class HelloPanel extends JSView {

  onShowHello() {

    // read msg from i18n model
    var oBundle = this.getModel("i18n").getResourceBundle();
    var sRecipient = this.getModel().getProperty("/recipient/name");
    var sMsg = oBundle.getText("helloMsg", [sRecipient]);

    // show message
    MessageToast.show(sMsg);

  }

  onOpenDialog() {
    this.oController.getOwnerComponent().openHelloDialog();
  }

  createContent() {
    return (
      <Panel
        headerText="{i18n>helloPanelTitle}"
        class="sapUiResponsiveMargin"
        width="auto"
        expandable="{device>/system/phone}"
        expanded="{= !${device>/system/phone} }"
      >
        <Button
          icon="sap-icon://world"
          text="{i18n>openDialogButtonText}"
          press={() => {
            this.onOpenDialog();
          }}
          class="sapUiSmallMarginEnd sapUiVisibleOnlyOnDesktop"
        />
        <Button
          text="{i18n>showHelloButtonText}"
          press={() => {
            this.onShowHello();
          }}
          class="myCustomButton"
        />
        <Input
          value="{/recipient/name}"
          valueLiveUpdate={true}
          width="60%"
        />
        <Text
          text="Hello {/recipient/name}"
          class="sapUiSmallMargin sapThemeHighlight-asColor myCustomText"
        />
      </Panel>
    );

  }

}
