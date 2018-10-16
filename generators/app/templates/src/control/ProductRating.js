import Control from "sap/ui/core/Control";
import RatingIndicator from "sap/m/RatingIndicator";
import Label from "sap/m/Label";
import Button from "sap/m/Button";

export default class ProductRating extends Control {

  metadata={
    properties: {
      value: {type: "float", defaultValue: 0}
    },
    aggregations: {
      _rating: {type: "sap.m.RatingIndicator", multiple: false, visibility: "hidden"},
      _label: {type: "sap.m.Label", multiple: false, visibility: "hidden"},
      _button: {type: "sap.m.Button", multiple: false, visibility: "hidden"}
    },
    events: {
      change: {
        parameters: {
          value: {type: "int"}
        }
      }
    }
  }

  init() {
    this.setAggregation("_rating", new RatingIndicator({
      value: this.getValue(),
      iconSize: "2rem",
      visualMode: "Half",
      liveChange: this._onRate.bind(this)
    }));
    this.setAggregation("_label", new Label({
      text: "{i18n>productRatingLabelInitial}"
    }).addStyleClass("sapUiTinyMargin"));
    this.setAggregation("_button", new Button({
      text: "{i18n>productRatingButton}",
      press: this._onSubmit.bind(this)
    }));
  }

  setValue(iValue) {
    this.setProperty("value", iValue, true);
    this.getAggregation("_rating").setValue(iValue);
  }

  _onRate(oEvent) {
    var oRessourceBundle = this.getModel("i18n").getResourceBundle();
    var fValue = oEvent.getParameter("value");

    this.setValue(fValue);

    this.getAggregation("_label").setText(oRessourceBundle.getText("productRatingLabelIndicator", [fValue, oEvent.getSource().getMaxValue()]));
    this.getAggregation("_label").setDesign("Bold");
  }

  _onSubmit(oEvent) {
    var oResourceBundle = this.getModel("i18n").getResourceBundle();

    this.getAggregation("_rating").setEnabled(false);
    this.getAggregation("_label").setText(oResourceBundle.getText("productRatingLabelFinal"));
    this.getAggregation("_button").setEnabled(false);
    this.fireEvent("change", {
      value: this.getValue()
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
    oRM.write("</div>");
  }
}
