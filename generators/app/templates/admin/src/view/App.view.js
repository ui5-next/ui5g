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
import ActionSheet from "sap/m/ActionSheet";
import ButtonType from "sap/m/ButtonType";
import VerticalPlacementType from "sap/m/VerticalPlacementType";
import ResponsivePopover from "sap/m/ResponsivePopover";
import PlacementType from "sap/m/PlacementType";
import NotificationListItem from "sap/m/NotificationListItem";
import CustomData from "sap/ui/core/CustomData";

export default class AppView extends JSView {

  _bExpanded = true

  onInit() {

    this.addStyleClass(this.getController().getOwnerComponent().getContentDensityClass());

    // if the app starts on desktop devices with small or medium screen size, collapse the sid navigation
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
      // if the device is phone, collapse the navigation side of the app to give more space
      if (Device.system.phone) {
        this.onSideNavButtonPress();
      }
      // get router
      this.getController().getOwnerComponent().getRouter().navTo(sKey);
    } else {
      MessageToast.show(sKey);
    }
  }

  onUserNamePress(oEvent) {
    var oBundle = this.getModel("i18n").getResourceBundle();
    // close message popover
    var oMessagePopover = this.getController().byId("errorMessagePopover");
    if (oMessagePopover && oMessagePopover.isOpen()) {
      oMessagePopover.destroy();
    }

    var fnHandleUserMenuItemPress = function(oEvent) {
      MessageToast.show(oEvent.getSource().getText() + " was pressed");
    };

    var oActionSheet = new ActionSheet(this.createId("userMessageActionSheet"), {
      title: oBundle.getText("userHeaderTitle"),
      showCancelButton: false,
      buttons: [
        <Button text="User Settings" type={ButtonType.Transparent} press={fnHandleUserMenuItemPress} />,
        <Button text="Online Guide" type={ButtonType.Transparent} press={fnHandleUserMenuItemPress} />,
        <Button text="Feedback" type={ButtonType.Transparent} press={fnHandleUserMenuItemPress} />,
        <Button text="Help" type={ButtonType.Transparent} press={fnHandleUserMenuItemPress} />,
        <Button text="Logout" type={ButtonType.Transparent} press={fnHandleUserMenuItemPress} />
      ],
      afterClose: function() {
        oActionSheet.destroy();
      }
    });
    // forward compact/cozy style into dialog
    syncStyleClass(this.getController().getOwnerComponent().getContentDensityClass(), this, oActionSheet);
    oActionSheet.openBy(oEvent.getSource());
  }

  _setToggleButtonTooltip(bSideExpanded) {
    var oToggleButton = this._sideNavigationToggleButton;
    if (bSideExpanded) {
      oToggleButton.setTooltip('Large Size Navigation');
    } else {
      oToggleButton.setTooltip('Small Size Navigation');
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

      this._page.addDependent(oMessagePopover);

      // forward compact/cozy style into dialog
      syncStyleClass(
        this.getController().getOwnerComponent().getContentDensityClass(),
        this,
        oMessagePopover
      );

      oMessagePopover.openBy(oEvent.getSource());
    }
  }

  onSideNavButtonPress() {
    var oToolPage = this._page;
    var bSideExpanded = oToolPage.getSideExpanded();
    this._setToggleButtonTooltip(bSideExpanded);
    oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
  }

  /**
		 * Event handler for the notification button
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
  onNotificationPress(oEvent) {
    var oBundle = this.getModel("i18n").getResourceBundle();
    // close message popover
    var oMessagePopover = this.byId("errorMessagePopover");
    if (oMessagePopover && oMessagePopover.isOpen()) {
      oMessagePopover.destroy();
    }
    var oButton = new Button({
      text: oBundle.getText("notificationButtonText"),
      press: function() {
        MessageToast.show("Show all Notifications was pressed");
      }
    });
    var oNotificationPopover = new ResponsivePopover(this.createId("notificationMessagePopover"), {
      title: oBundle.getText("notificationTitle"),
      contentWidth: "300px",
      endButton : oButton,
      placement: PlacementType.Bottom,
      content: {
        path: 'alerts>/alerts/notifications',
        factory: this._createNotification
      },
      afterClose: function() {
        oNotificationPopover.destroy();
      }
    });
    this._page.addDependent(oNotificationPopover);
    // forward compact/cozy style into dialog
    syncStyleClass(this.getController().getOwnerComponent().getContentDensityClass(), this, oNotificationPopover);
    oNotificationPopover.openBy(oEvent.getSource());
  }

  /**
		 * Factory function for the notification items
		 * @param {string} sId The id for the item
		 * @param {sap.ui.model.Context} oBindingContext The binding context for the item
		 * @returns {sap.m.NotificationListItem} The new notification list item
		 * @private
		 */
  _createNotification(sId, oBindingContext) {
    var oBindingObject = oBindingContext.getObject();
    var oNotificationItem = new NotificationListItem({
      title: oBindingObject.title,
      description: oBindingObject.description,
      priority: oBindingObject.priority,
      close: function(oEvent) {
        var sBindingPath = oEvent.getSource().getCustomData()[0].getValue();
        var sIndex = sBindingPath.split("/").pop();
        var aItems = oEvent.getSource().getModel("alerts").getProperty("/alerts/notifications");
        aItems.splice(sIndex, 1);
        oEvent.getSource().getModel("alerts").setProperty("/alerts/notifications", aItems);
        oEvent.getSource().getModel("alerts").updateBindings("/alerts/notifications");
        MessageToast.show("Notification has been deleted.");
      },
      datetime: oBindingObject.date,
      authorPicture: oBindingObject.icon,
      press: function() {
        var oBundle = this.getModel("i18n").getResourceBundle();
        MessageToast.show(oBundle.getText("notificationItemClickedMessage", oBindingObject.title));
      },
      customData : [
        <CustomData key="path" value={oBindingContext.getPath()} />
      ]
    });
    return oNotificationItem;
  }

  renderHeader() {
    var layout1 = <OverflowToolbarLayoutData priority="NeverOverflow" />;
    var layout2 = <OverflowToolbarLayoutData closeOverflowOnInteraction={false} />;

    this._sideNavigationToggleButton = <Button
      id="sideNavigationToggleButton"
      icon="sap-icon://menu2"
      type="Transparent"
      press={this.onSideNavButtonPress.bind(this)}
      tooltip="{i18n>navigationToggleButtonTooltip}"
      layoutData={layout1}
    />;

    return (
      <ToolHeader>
        {this._sideNavigationToggleButton}
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
          press={this.onNotificationPress.bind(this)}
          tooltip="{i18n>notificationButtonTooltip}"
          layoutData={layout2}
        />
        <Button
          id="userButton"
          text="{i18n>userName}"
          type="Transparent"
          press={this.onUserNamePress.bind(this)}
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
                  key="{side>key}"
                />
              )
            }}
          />
        }
      />
    );
  }

  renderMainContent() {
    return (<App id="mainContents" />);
  }

  createContent() {
    this.onInit();
    this._page = <ToolPage
      id="app"
      class="sapUiDemoToolPage"
      header={this.renderHeader()}
      sideContent={this.renderSideContent()}
      mainContents={this.renderMainContent()}
    />;
    return this._page;
  }

}