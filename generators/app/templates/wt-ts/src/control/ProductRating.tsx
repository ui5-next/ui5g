import Control from "sap/ui/core/Control";
import RatingIndicator from "sap/m/RatingIndicator";
import Label from "sap/m/Label";
import Button from "sap/m/Button";
import InvisibleText from "sap/ui/core/InvisibleText";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import LabelDesign from "sap/m/LabelDesign";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

interface ProductRatingProps {
  value?: PropertyBindingInfo | number | ExpressionBindingInfo;
  change?: any;
}

export default class ProductRating extends Control<ProductRatingProps> {

  metadata = {
    properties: {
      value: { type: "float", defaultValue: 0 }
    },
    aggregations: {
      _rating: { type: "sap.m.RatingIndicator", multiple: false, visibility: "hidden" },
      _label: { type: "sap.m.Label", multiple: false, visibility: "hidden" },
      _button: { type: "sap.m.Button", multiple: false, visibility: "hidden" },
      _invText1: { type: "sap.ui.core.InvisibleText", multiple: false, visibility: "hidden" },
      _invText2: { type: "sap.ui.core.InvisibleText", multiple: false, visibility: "hidden" },
      _invText3: { type: "sap.ui.core.InvisibleText", multiple: false, visibility: "hidden" },
      _invText4: { type: "sap.ui.core.InvisibleText", multiple: false, visibility: "hidden" }
    },
    events: {
      change: {
        parameters: {
          value: { type: "int" }
        }
      }
    }
  }

  init() {
    var invText1 = <InvisibleText text="{i18n>ratingIndicatorLabel}" />;
    var invText2 = <InvisibleText text="{i18n>ratingIndicatorDescription}" />;
    var invText3 = <InvisibleText text="{i18n>rateButtonLabel}" />;
    var invText4 = <InvisibleText text="{i18n>rateButtonDescription}" />;

    this.setAggregation("_invText1", invText1);
    this.setAggregation("_invText2", invText2);
    this.setAggregation("_invText3", invText3);
    this.setAggregation("_invText4", invText4);

    this.setAggregation(
      "_rating",
      <RatingIndicator
        value={this.getProperty("value")}
        iconSize="2rem"
        visualMode="Half"
        liveChange={this._onRate.bind(this)}
        ariaLabelledBy={invText1}
        ariaDescribedBy={invText2}
      />
    );

    this.setAggregation(
      "_label",
      <Label text="{i18n>productRatingLabelInitial}" class="sapUiSmallMargin" />
    );
    this.setAggregation(
      "_button",
      <Button
        text="{i18n>productRatingButton}"
        press={this._onSubmit.bind(this)}
        ariaLabelledBy={invText3}
        ariaDescribedBy={invText4}
        class="sapUiTinyMarginTopBottom"
      />
    );
  }

  setValue(fValue) {
    this.setProperty("value", fValue, true);
    this._getAggregationRating().setValue(fValue);
  }

  reset() {
    var oResourceBundle = ((this.getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle);

    this.setValue(0);
    this._getAggregationLabel().setDesign(LabelDesign.Standard);
    this._getAggregationRating().setEnabled(true);
    this._getAggregationLabel().setText(oResourceBundle.getText("productRatingLabelInitial"));
    (this.getAggregation("_button") as Button).setEnabled(true);

  }

  _onRate(oEvent) {
    var oResourceBundle = (this.getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
    var fValue = oEvent.getParameter("value");

    this.setProperty("value", fValue, true);

    this
      ._getAggregationLabel()
      .setText(
        oResourceBundle.getText("productRatingLabelIndicator", [fValue, oEvent.getSource().getMaxValue()])
      );

    this._getAggregationLabel().setDesign(LabelDesign.Bold);
  }

  private _getAggregationRating(): RatingIndicator {
    return this.getAggregation("_rating") as RatingIndicator
  }
  private _getAggregationLabel(): Label {
    return this.getAggregation("_label") as Label
  }
  private _getAggregationButton(): Button {
    return this.getAggregation("_button") as Button
  }

  _onSubmit() {
    var oResourceBundle = (this.getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;

    this._getAggregationRating().setEnabled(false);
    this._getAggregationLabel().setText(oResourceBundle.getText("productRatingLabelFinal"));
    this._getAggregationButton().setEnabled(false);
    this.fireEvent("change", {
      value: this.getProperty("value")
    });
  }

  renderer(oRM, oControl) {
    oRM.write("<div");
    oRM.writeControlData(oControl);
    oRM.addClass("myAppDemoWTProductRating");
    oRM.writeClasses();
    oRM.write(">");
    oRM.renderControl(oControl.getAggregation("_rating"));
    oRM.renderControl(oControl.getAggregation("_label"));
    oRM.renderControl(oControl.getAggregation("_button"));
    oRM.renderControl(oControl.getAggregation("_invText1"));
    oRM.renderControl(oControl.getAggregation("_invText2"));
    oRM.renderControl(oControl.getAggregation("_invText3"));
    oRM.renderControl(oControl.getAggregation("_invText4"));
    oRM.write("</div>");
  }
}
