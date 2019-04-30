export const manifest = {
  "_version": "1.1.0",
  "sap.app": {
    "_version": "1.1.0",
    "id": "<%= namespace %>",
    "type": "application",
    "i18n": "i18n/i18n.properties",
    "title": "{{appTitle}}",
    "description": "{{appDescription}}",
    "applicationVersion": {
      "version": "1.0.0"
    },
    "dataSources": {
      "invoiceRemote": {
        "uri": "/destinations/northwind/V2/Northwind/Northwind.svc/",
        "type": "OData",
        "settings": {
          "odataVersion": "2.0"
        }
      }
    }
  },
  "sap.ui": {
    "_version": "1.1.0",
    "technology": "UI5",
    "deviceTypes": {
      "desktop": true,
      "tablet": true,
      "phone": true
    },
    "supportedThemes": [
      "sap_bluecrystal"
    ]
  },
  "sap.ui5": {
    "_version": "1.1.0",
    "rootView": {
      "viewName": "<%= namespace %>.views.App",
      "type": "JS"
    },
    "dependencies": {
      "minUI5Version": "1.30",
      "libs": {
        "sap.m": {}
      }
    },
    "models": {
      "i18n": {
        "type": "sap.ui.model.resource.ResourceModel",
        "settings": {
          "bundleName": "<%= namespace %>.i18n.i18n"
        }
      },
      "invoice": {
        "dataSource": "invoiceRemote"
      }
    },
    "resources": {
      "css": [
        {
          "uri": "css/style.css"
        }
      ]
    },
    "routing": {
      "config": {
        "routerClass": "sap.m.routing.Router",
        "viewType": "JS",
        "viewPath": "<%= namespace %>.views",
        "controlId": "app",
        "controlAggregation": "pages"
      },
      "routes": [
        {
          "pattern": "",
          "name": "overview",
          "target": "overview"
        },
        {
          "pattern": "detail/{invoicePath}",
          "name": "detail",
          "target": "detail"
        }
      ],
      "targets": {
        "overview": {
          "viewName": "Overview"
        },
        "detail": {
          "viewName": "Detail"
        }
      }
    }
  }
};