import JSView from "sap/ui/core/mvc/JSView";
import Panel from "sap/m/Panel";
import Button from "sap/m/Button";
import Input from "sap/m/Input";
import Text from "sap/m/Text";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import Component from "../Component";
import BindingMode from "sap/ui/model/BindingMode";

interface HelloPanelProps {
  /**
   * extra props value for view
   */
  extra: string
}

export default class HelloPanel extends JSView<HelloPanelProps>{

  /**
   * init state
   */
  state = {
    value: "0"
  };

  init() {
    /**
     * one way model
     * like react state
     */
    this.setModel(new JSONModel(this.state).setDefaultBindingMode(BindingMode.OneWay));
  }

  /**
   * setState in react, update model
   */
  setState(merge, fn?) {
    const oModel = this.getModel() as JSONModel;
    oModel.setData(merge, true);
    this.state = oModel.getData();
    if (fn) {
      fn();
    }
  }

  private _getI18NModel(): ResourceModel {
    return this.getModel("i18n") as ResourceModel
  }

  private _getI18NModelResourceBundle(): ResourceBundle {
    return this._getI18NModel().getResourceBundle() as ResourceBundle
  }

  onShowHello() {

    // read msg from i18n model
    var oBundle = this._getI18NModelResourceBundle()
    var sRecipient = this.state.value;
    var sMsg = oBundle.getText("helloMsg", [sRecipient]);

    // show message
    MessageToast.show(sMsg);
  }

  onOpenDialog() {
    ((this.getController() as Controller).getOwnerComponent() as Component).openHelloDialog();
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
