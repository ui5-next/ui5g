import JSView from "sap/ui/core/mvc/JSView";
import ToolPage from "sap/tnt/ToolPage";
import ToolHeader from "sap/tnt/ToolHeader";
import Button from "sap/m/Button";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import SideNavigation from "sap/tnt/SideNavigation";
import NavigationList from "sap/tnt/NavigationList";
import NavigationListItem from "sap/tnt/NavigationListItem";
import App from "sap/m/App";
import Title from "sap/m/Title";
import OverflowToolbarLayoutData from "sap/m/OverflowToolbarLayoutData";
import syncStyleClass from "sap/ui/core/syncStyleClass";
import MessagePopover from "sap/m/MessagePopover";
import MessagePopoverItem from "sap/m/MessagePopoverItem";
import Link from "sap/m/Link";
import MessageToast from "sap/m/MessageToast";
import Device from "sap/ui/Device";
import { VerticalPlacementType } from "sap/m/library";

export default class AppView extends JSView {

  _bExpanded = true

  onInit() {
    this.addStyleClass(this.getController().getOwnerComponent().getContentDensityClass());

    // if the app starts on desktop devices with small or meduim screen size, collaps the sid navigation
    if (Device.resize.width <= 1024) {
      this.onSideNavButtonPress();
    }

    Device.media.attachHandler(function(oDevice) {
      if ((oDevice.name === "Tablet" && this._bExpanded) || oDevice.name === "Desktop") {
        this.onSideNavButtonPress();
        // set the _bExpanded to false on tablet devices
        // extending and collapsing of side navigation should be done when resizing from
        // desktop to tablet screen sizes)
        this._bExpanded = (oDevice.name === "Desktop");
      }
    }.bind(this));
  }

  /**
		 * Convenience method for accessing the router.
		 * @public
		 * @param {sap.ui.base.Event} oEvent The item select event
		 */
  onItemSelect(oEvent) {
    var oItem = oEvent.getParameter('item');
    var sKey = oItem.getKey();
    // if you click on home, settings or statistics button, call the navTo function
    if ((sKey === "home" || sKey === "masterSettings" || sKey === "statistics")) {
      // if the device is phone, collaps the navigation side of the app to give more space
      if (Device.system.phone) {
        this.onSideNavButtonPress();
      }
      // get router
      this.getController().getOwnerComponent().getRouter().navTo(sKey);
    } else {
      MessageToast.show(sKey);
    }
  }

  _createError(sId, oBindingContext) {
    var oBindingObject = oBindingContext.getObject();
    var oLink = new Link("moreDetailsLink", {
      text: "More Details",
      press: function() {
        MessageToast.show("More Details was pressed");
      }
    });
    var oMessageItem = new MessagePopoverItem({
      title: oBindingObject.title,
      subtitle: oBindingObject.subTitle,
      description: oBindingObject.description,
      counter: oBindingObject.counter,
      link: oLink
    });
    return oMessageItem;
  }

  // Errors Pressed
  onMessagePopoverPress(oEvent) {

    if (!this.getController().byId("errorMessagePopover")) {

      var oMessagePopover = new MessagePopover(this.createId("errorMessagePopover"), {
        placement: VerticalPlacementType.Bottom,
        items: {
          path: 'alerts>/alerts/errors',
          factory: this._createError.bind(this)
        },
        afterClose: function() {
          oMessagePopover.destroy();
        }
      });

      this.addDependent(oMessagePopover);

      // forward compact/cozy style into dialog
      syncStyleClass(
        this.getController().getOwnerComponent().getContentDensityClass(),
        this,
        oMessagePopover
      );

      oMessagePopover.openBy(oEvent.getSource());
    }
  }

  renderHeader() {
    var layout1 = <OverflowToolbarLayoutData priority="NeverOverflow" />;
    var layout2 = <OverflowToolbarLayoutData closeOverflowOnInteraction={false} />;

    return (
      <ToolHeader>
        <Button
          id="sideNavigationToggleButton"
          icon="sap-icon://menu2"
          type="Transparent"
          press=".onSideNavButtonPress"
          tooltip="{i18n>navigationToggleButtonTooltip}"
          layoutData={layout1}
        />
        <ToolbarSpacer />
        <Title text="{i18n>appTitle}" level="H2" />
        <ToolbarSpacer />
        <Button
          id="errorButton"
          icon="sap-icon://message-popup"
          visible="{= ${alerts>/alerts/errors}.length === 0 ? false : true }"
          type="Transparent"
          press={this.onMessagePopoverPress.bind(this)}
          tooltip="{i18n>errorButtonTooltip}"
          layoutData={layout2}
        />
        <Button
          id="notificationButton"
          icon="sap-icon://ui-notifications"
          visible="{= ${alerts>/alerts/notifications}.length === 0 ? false : true }"
          type="Transparent"
          press=".onNotificationPress"
          tooltip="{i18n>notificationButtonTooltip}"
          layoutData={layout2}
        />
        <Button
          id="userButton"
          text="{i18n>userName}"
          type="Transparent"
          press=".onUserNamePress"
          layoutData={layout2}
        />
      </ToolHeader>
    );
  }

  renderSideContent() {
    return (
      <SideNavigation
        expanded={true}
        itemSelect={this.onItemSelect.bind(this)}
        fixedItem={
          <NavigationList
            // item binding
            // template
            items={{
              path: 'side>/fixedNavigation',
              templateShareable: false,
              template: (
                <NavigationListItem text="{side>title}" icon="{side>icon}" key="{side>key}" />
              )
            }}

          />
        }
        item={
          <NavigationList
            items={{
              path: 'side>/navigation',
              templateShareable: false,
              template: (
                <NavigationListItem
                  text="{side>title}"
                  icon="{side>icon}"
                  expanded="{side>expanded}"
                  items={{
                    path: 'side>items',
                    templateShareable: false,
                    template: (
                      <NavigationListItem text="{side>title}" key="{side>key}" />
                    )
                  }}
                  key="{side>key}" />
              )
            }} />
        }
      />
    );
  }

  renderMainContent() {
    return (<App id="mainContents" />);
  }

  createContent() {
    this.onInit();
    return (
      <ToolPage
        id="app"
        class="sapUiDemoToolPage"
        header={this.renderHeader()}
        sideContent={this.renderSideContent()}
        mainContents={this.renderMainContent()}
      />
    );
  }

}