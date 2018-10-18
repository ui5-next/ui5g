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


export default class InvoiceList extends JSView {

  renderColumns() {
    return [
      <Column
        hAlign="End"
        minScreenWidth="Small"
        demandPopin={true}
        width="4em">
        <Text text="{i18n>columnQuantity}" />
      </Column>,
      <Column>
        <Text text="{i18n>columnName}" />
      </Column>,
      <Column minScreenWidth="Small" demandPopin={true}>
        <Text text="{i18n>columnStatus}" />
      </Column>,
      <Column minScreenWidth="Tablet" demandPopin={false} >
        <Text text="{i18n>columnSupplier}" />
      </Column>,
      <Column hAlign="End">
        <Text text="{i18n>columnPrice}" />
      </Column>
    ];
  }

  renderItemsTemplate() {
    return (
      <ColumnListItem
        type="Navigation"
        press={(e) => this.oController.onPress(e)}
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
              formatter: '.formatter.statusText'
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

  createContent(oController) {
    return (
      <Table
        id="invoiceList"
        class="sapUiResponsiveMargin"
        width="auto"
        headerToolbar={
          <Toolbar>
            <Title>A Header Here</Title>
            <ToolbarSpacer />
            <SearchField width="50%" search={oController.onFilterInvoices.bind(oController)} selectOnFocus={false} />
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
    );
  }

}
