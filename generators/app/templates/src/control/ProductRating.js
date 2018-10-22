import Control from "sap/ui/core/Control";
import RatingIndicator from "sap/m/RatingIndicator";
import Label from "sap/m/Label";
import Button from "sap/m/Button";
import InvisibleText from "sap/ui/core/InvisibleText";

export default class ProductRating extends Control {

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
        value={this.getValue()}
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
    this.getAggregation("_rating").setValue(fValue);
  }

  reset() {
    var oResourceBundle = this.getModel("i18n").getResourceBundle();

    this.setValue(0);
    this.getAggregation("_label").setDesign("Standard");
    this.getAggregation("_rating").setEnabled(true);
    this.getAggregation("_label").setText(oResourceBundle.getText("productRatingLabelInitial"));
    this.getAggregation("_button").setEnabled(true);
  }

  _onRate(oEvent) {
    var oRessourceBundle = this.getModel("i18n").getResourceBundle();
    var fValue = oEvent.getParameter("value");

    this.setProperty("value", fValue, true);

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
    oRM.renderControl(oControl.getAggregation("_invText1"));
    oRM.renderControl(oControl.getAggregation("_invText2"));
    oRM.renderControl(oControl.getAggregation("_invText3"));
    oRM.renderControl(oControl.getAggregation("_invText4"));
    oRM.write("</div>");
  }
}
