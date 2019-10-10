import JSView from "sap/ui/core/mvc/JSView";
import Table from "sap/m/Table";
import ColumnListItem from "sap/m/ColumnListItem";
import ObjectNumber from "sap/m/ObjectNumber";
import Column from "sap/m/Column";
import Toolbar from "sap/m/Toolbar";
import Title from "sap/m/Title";
import Text from "sap/m/Text";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import SearchField from "sap/m/SearchField";
import ObjectIdentifier from "sap/m/ObjectIdentifier";

import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import { createFormatter } from "../model/formatter";
import ListBinding from "sap/ui/model/ListBinding";
import UIComponent from "sap/ui/core/UIComponent";

export default class InvoiceList extends JSView {

  onFilterInvoices(oEvent) {

    // build filter array
    var aFilter = [];
    var sQuery = oEvent.getParameter("query");
    if (sQuery) {
      aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
    }

    // filter binding
    var oBinding = this._invoiceList.getBinding("items") as ListBinding;

    oBinding.filter(aFilter);
  }

  onPress(oEvent) {
    var oItem = oEvent.getSource();
    var oRouter = UIComponent.getRouterFor(this);
    oRouter.navTo("detail", {
      invoicePath: oItem.getBindingContext("invoice").getPath().substr(1)
    });
  }

  renderColumns() {
    return [
      <Column
        hAlign="End"
        minScreenWidth="Small"
        demandPopin={true}
        width="4em"
        header={<Text text="{i18n>columnQuantity}" />}
      />,
      <Column
        header={<Text text="{i18n>columnName}" />}
      />,
      <Column
        minScreenWidth="Small"
        demandPopin={true}
        header={<Text text="{i18n>columnStatus}" />}
      />,
      <Column
        minScreenWidth="Tablet"
        demandPopin={false}
        header={<Text text="{i18n>columnSupplier}" />}
      />,
      <Column
        hAlign="End"
        header={<Text text="{i18n>columnPrice}" />}
      />
    ];
  }

  private _formatter: any;

  renderItemsTemplate() {
    return (
      <ColumnListItem
        type="Navigation"
        press={this.onPress.bind(this)}
        cells={[
          <ObjectNumber
            number="{invoice>Quantity}"
            emphasized={false}
          />,
          <ObjectIdentifier
            title="{invoice>ProductName}"
          />,
          <Text
            text={{
              path: 'invoice>Status',
              formatter: this._formatter.statusText
            }}
          />,
          <Text text="{invoice>ShipperName}" />,
          <ObjectNumber
            number={{
              parts: [{ path: 'invoice>ExtendedPrice' }, { path: 'view>/currency' }],
              type: 'sap.ui.model.type.Currency',
              formatOptions: {
                showMeasure: false
              }
            }}
            unit="{view>/currency}"
            state="{= ${invoice>ExtendedPrice} > 50 ? 'Error' : 'Success' }"
          />
        ]}
      />
    );
  }

  private _invoiceList: Table;

  createContent() {

    var oViewModel = new JSONModel({ currency: "EUR" });
    this.setModel(oViewModel, "view");
    this._formatter = createFormatter(this);

    this._invoiceList = <Table
      id="invoiceList"
      class="sapUiResponsiveMargin"
      width="auto"
      headerToolbar={
        <Toolbar>
          <Title>A Header Here</Title>
          <ToolbarSpacer />
          <SearchField width="50%" search={this.onFilterInvoices.bind(this)} selectOnFocus={false} />
        </Toolbar>
      }
      columns={this.renderColumns()}
      items={{
        path: 'invoice>/Invoices',
        template: this.renderItemsTemplate(),
        sorter: {
          path: 'ShipperName',
          group: true
        }
      }}
    />

    return this._invoiceList;
  }

}
