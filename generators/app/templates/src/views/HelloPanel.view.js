import JSView from "sap/ui/core/mvc/JSView";
import Panel from "sap/m/Panel";
import Button from "sap/m/Button";
import Input from "sap/m/Input";
import Text from "sap/m/Text";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";

export default class HelloPanel extends JSView {

  /**
   * init state
   */
  state = {
    value: 0
  };

  init() {
    /**
     * one way model
     * like react state
     */
    this.setModel(new JSONModel(this.state).setDefaultBindingMode("OneWay"));
  }

  /**
   * setState in react, update model
   */
  setState(merge, fn) {
    const oModel = this.getModel();
    oModel.setData(merge, true);
    this.state = oModel.getData();
    if (fn) {
      fn();
    }
  }

  onShowHello() {

    // read msg from i18n model
    var oBundle = this.getModel("i18n").getResourceBundle();
    var sRecipient = this.state.value;
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
          value="{/value}"
          liveChange={({ mParameters: { newValue } }) => {
            this.setState({ value: newValue });
          }}
          valueLiveUpdate={true}
          width="60%"
        />
        <Text
          text="Hello {/value}"
          class="sapUiSmallMargin sapThemeHighlight-asColor myCustomText"
        />
      </Panel>
    );

  }

}
